'use server';

import { ajRestrictiveAnonymous, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { OldActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { credentialsSchema } from './credentials-schema';

const signinSchema = credentialsSchema.pick({ email: true, password: true });

type Signin = z.infer<typeof signinSchema>;
type SigninInput = Partial<Signin>;
type SigninError = Partial<Record<keyof SigninInput, string[]>> & {
  unexpected?: string;
};
export type SigninResponse =
  OldActionResponse<SigninInput, SigninError> extends infer U
    ? U extends { type: 'error' }
      ? U & {
          payload: {
            errors: {
              auth?: {
                status: 'EMAIL_NOT_VERIFIED' | 'OTHERS';
                message: string;
              };
            };
          };
        }
      : U
    : never;
export type ErrorSigninResponse = Extract<SigninResponse, { type: 'error' }>;
export type SuccessSigninResponse = Extract<
  SigninResponse,
  { type: 'success' }
>;

export async function signinAction(
  state: SigninResponse,
  formData: FormData
): Promise<SigninResponse> {
  const input = Object.fromEntries(formData.entries());

  const parsedResult = signinSchema.safeParse(input);

  if (!parsedResult.success) {
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
      },
    };
  }

  const decision = await ajRestrictiveAnonymous.protect(await request(), {
    action: 'sa-sign-in',
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const signinCredentials = parsedResult.data;

  try {
    const response = await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: signinCredentials.email,
        password: signinCredentials.password,
      },
    });

    const requestReferer = (await headers()).get('referer');
    const requestUrl = requestReferer ? new URL(requestReferer) : undefined;

    if ('twoFactorRedirect' in response) {
      const hasCallbackUrl = requestUrl?.searchParams.has('callbackUrl');

      redirect(
        hasCallbackUrl
          ? `${ROUTES.auth.nested['verify-2fa'].href}?${requestUrl!.searchParams.toString()}`
          : ROUTES.auth.nested['verify-2fa'].href
      );
    }

    return {
      type: 'success',
      payload: {
        userEntered: null,
        errors: null,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (!(error instanceof APIError))
      return {
        type: 'error',
        payload: {
          userEntered: signinCredentials,
          errors: { unexpected: (error as Error)?.message },
        },
      };

    if (error.status !== 'FORBIDDEN' && error.statusCode !== 403)
      return {
        type: 'error',
        payload: {
          userEntered: signinCredentials,
          errors: {
            auth: { status: 'OTHERS', message: error.message },
          },
        },
      };

    return {
      type: 'error',
      payload: {
        userEntered: signinCredentials,
        errors: {
          auth: { status: 'EMAIL_NOT_VERIFIED', message: error.message },
        },
      },
    };
  }
}
