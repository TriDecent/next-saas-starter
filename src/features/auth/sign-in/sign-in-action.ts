'use server';

import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { getAuthService } from '@/services';
import type { SignInResponse } from '@/services/auth';
import { signInSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

type SignInState = SignInResponse | { type: 'initial' };

export async function signInAction(
  state: SignInState,
  input: unknown
): Promise<SignInState> {
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

  const service = await getAuthService();

  return service.signIn(signInCredentials);
}
