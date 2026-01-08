'use server';

import { auth } from '@/lib/auth';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { signInSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { headers } from 'next/headers';

type SignInResponse = ActionResponse<
  { redirect?: string },
  { status?: 'EMAIL_NOT_VERIFIED'; email?: string; message: string }
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

  const signInCredentials = parsedResult.data;

  try {
    const response = await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: signInCredentials.email,
        password: signInCredentials.password,
        rememberMe: signInCredentials.trustDevice,
      },
    });

    if (!('twoFactorRedirect' in response))
      return { type: 'success', payload: {} };

    const requestReferer = (await headers()).get('referer');
    const requestUrl = requestReferer ? new URL(requestReferer) : undefined;
    const hasCallbackUrl = requestUrl?.searchParams.has('callbackUrl');

    return {
      type: 'success',
      payload: {
        redirect: hasCallbackUrl
          ? `${ROUTES.auth.nested['verify-2fa'].href}?${requestUrl!.searchParams.toString()}`
          : ROUTES.auth.nested['verify-2fa'].href,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const isEmailNotVerified =
      error instanceof APIError &&
      error.status === 'FORBIDDEN' &&
      error.statusCode === 403;

    return {
      type: 'error',
      payload: {
        status: isEmailNotVerified ? 'EMAIL_NOT_VERIFIED' : undefined,
        email: isEmailNotVerified ? signInCredentials.email : undefined,
        message:
          error instanceof Error || error instanceof APIError
            ? error.message
            : 'Unknown error',
      },
    };
  }
}
