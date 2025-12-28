'use server';

import { signInSchema } from '@/features/_shared';
import { ajRestrictiveAnonymous, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type SignInResponse = ActionResponse<
  undefined,
  { status?: 'EMAIL_NOT_VERIFIED'; message: string }
>;

export async function signInAction(
  state: SignInResponse,
  input: unknown
): Promise<SignInResponse> {
  const parsedResult = signInSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: { message: 'Invalid input data.' },
    };

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

    return { type: 'success', payload: undefined };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      type: 'error',
      payload: {
        status:
          error instanceof APIError &&
          error.status === 'FORBIDDEN' &&
          error.statusCode === 403
            ? 'EMAIL_NOT_VERIFIED'
            : undefined,
        message:
          error instanceof Error || error instanceof APIError
            ? error.message
            : 'Unknown error',
      },
    };
  }
}
