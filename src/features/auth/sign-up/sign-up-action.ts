'use server';

import { SignUpSchema } from '@/features/auth/schema';
import { getAuthService } from '@/infrastructure/composition/factory';
import { ajSignup, handleDeniedInServerAction } from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';
import type { SignUpResult } from '../server';

type SignUpState = ActionState<
  Extract<SignUpResult, { type: 'success' }>['payload'],
  Extract<SignUpResult, { type: 'error' }>['payload']
>;

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
