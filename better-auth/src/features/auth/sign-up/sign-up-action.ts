'use server';

import { auth } from '@/lib/auth';
import { ajSignup, handleDeniedInServerAction } from '@/lib/security';
import { signUpSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type SignUpResponse = ActionResponse<
  { name: string; email: string },
  { message: string }
>;

export async function signUpAction(
  state: SignUpResponse,
  input: unknown
): Promise<SignUpResponse> {
  const parsedResult = signUpSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: { message: 'Invalid sign up data' },
    };

  const signupCredentials = parsedResult.data;

  const signupDecision = await ajSignup.protect(await request(), {
    action: 'sa-sign-up',
    email: signupCredentials.email,
  });

  if (signupDecision.isDenied()) handleDeniedInServerAction(signupDecision);

  try {
    const signUpResult = await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: signupCredentials.name,
        email: signupCredentials.email,
        password: signupCredentials.password,
        favoriteNumber: signupCredentials.favoriteNumber,
        welcomeSent: false,
      },
    });

    return {
      type: 'success',
      payload: { name: signUpResult.user.name, email: signUpResult.user.email },
    };
  } catch (error) {
    return {
      type: 'error',
      payload: {
        message:
          error instanceof Error || error instanceof APIError
            ? error.message
            : 'Unknown error',
      },
    };
  }
}
