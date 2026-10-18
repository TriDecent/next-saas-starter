'use server';

import { SignInSchema } from '@/features/auth/schema';
import { getAuthService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';
import type { SignInResult } from '../server';

type SignInState = ActionState<
  Extract<SignInResult, { type: 'success' }>['payload'],
  Extract<SignInResult, { type: 'error' }>['payload']
>;

export async function signInAction(
  state: SignInState,
  input: unknown
): Promise<SignInState> {
  const parsedResult = SignInSchema.safeParse(input);

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
