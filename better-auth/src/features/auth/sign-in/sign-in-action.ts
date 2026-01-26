'use server';

import { getAuthService } from '@/infrastructure/service';
import type { SignInResponse } from '@/infrastructure/service/auth';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/security';
import { signInSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

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

  const service = await getAuthService();

  return service.signIn(signInCredentials);
}
