'use server';

import { BasicAuthSchema, TwoFAAuthSchema } from '@/features/auth/schema';
import { getUserService } from '@/infrastructure/composition/factory';
import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { cookies } from 'next/headers';

type AuthenticatePriorState = ActionState<
  { sudoToken: string } | undefined,
  { message: string }
>;

export async function authenticatePriorAction(
  state: AuthenticatePriorState,
  input: unknown
): Promise<AuthenticatePriorState> {
  const [req, cookiesList] = await Promise.all([request(), cookies()]);

  const service = await getUserService(ROUTES.settings.nested.security.href);

  const schema = service.actor.twoFactorEnabled
    ? TwoFAAuthSchema
    : BasicAuthSchema;

  const parsedInput = schema.safeParse(input);

  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const decision = await ajLaxAuthenticated.protect(req, {
    action: 'authenticate-prior-action',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const result = await service.authenticatePrior(
    parsedInput.data.password,
    'code' in parsedInput.data
      ? (parsedInput.data.code as string) /* validated with twoFAAuthSchema */
      : undefined
  );

  if (result.type === 'success')
    cookiesList.set(
      COOKIES['sudo-token'].name,
      result.payload.sudoToken,
      COOKIES['sudo-token'].config
    );

  return result.type === 'success' ? { ...result, payload: undefined } : result;
}
