'use server';

import { getAuthService } from '@/infrastructure/service';
import type { SignUpResponse } from '@/infrastructure/service/auth';
import { ajSignup, handleDeniedInServerAction } from '@/lib/security';
import { signUpSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

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

  const signUpCredentials = parsedResult.data;

  const signUpDecision = await ajSignup.protect(await request(), {
    action: 'sa-sign-up',
    email: signUpCredentials.email,
  });

  if (signUpDecision.isDenied()) handleDeniedInServerAction(signUpDecision);

  const service = await getAuthService();

  return service.signUp(signUpCredentials);
}
