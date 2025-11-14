'use server';

import type { ActionResponse } from '@/features/shared/types';
import { ajLaxAnonymous, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { credentialsSchema } from './credentials-schema';

const signinSchema = credentialsSchema.pick({ email: true, password: true });

type Signin = z.infer<typeof signinSchema>;
type SigninInput = Partial<Signin>;
type SigninError = Partial<Record<keyof SigninInput, string[]>> & {
  unexpected?: string;
};
export type SigninResponse =
  ActionResponse<SigninInput, SigninError> extends infer U
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
  const decision = await ajLaxAnonymous.protect(await request(), {
    action: 'sa-sign-in-input-check',
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

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

  const signinCredentials = parsedResult.data;

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: signinCredentials.email,
        password: signinCredentials.password,
      },
    });

    return {
      type: 'success',
      payload: {
        userEntered: null,
        errors: null,
      },
    };
  } catch (error) {
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
