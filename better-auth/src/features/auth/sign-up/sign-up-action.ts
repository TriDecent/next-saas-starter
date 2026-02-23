'use server';

import { ajSignup, handleDeniedInServerAction } from '@/lib/security';
import { getAuthService } from '@/services';
import type { SignUpResponse } from '@/services/auth';
import { signUpSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

type SignUpState = SignUpResponse | { type: 'initial' };

export async function signUpAction(
  state: SignUpState,
  input: unknown
): Promise<SignUpState> {
  const parsedResult = signUpSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: { message: 'Invalid sign up data' },
    };

  const signUpCredentials = parsedResult.data;

  const signUpDecision = await ajSignup.protect(await request(), {
    action: 'sa-sign-up',
    email: signUpCredentials.email,
  });

  if (signUpDecision.isDenied()) handleDeniedInServerAction(signUpDecision);

  const service = await getAuthService();

  return service.signUp(signUpCredentials);
}
