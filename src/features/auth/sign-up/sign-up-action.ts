'use server';

import { SignUpSchema } from '@/features/auth/schema';
import type { SignUpResponse } from '@/features/auth/server';
import { getAuthService } from '@/infrastructure/composition/factory';
import { ajSignup, handleDeniedInServerAction } from '@/lib/arcjet';
import { request } from '@arcjet/next';

type SignUpState = SignUpResponse | { type: 'initial' };

export async function signUpAction(
  state: SignUpState,
  input: unknown
): Promise<SignUpState> {
  const parsedResult = SignUpSchema.safeParse(input);

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
