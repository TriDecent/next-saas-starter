'use server';

import { BasicAuthSchema, TwoFAAuthSchema } from '@/features/auth/schema';
import type { GeneralAuthResponse } from '@/features/auth/server';
import { getUserService } from '@/infrastructure/composition/factory';
import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { cookies } from 'next/headers';

type Response = GeneralAuthResponse | { type: 'initial' };

export async function authenticatePriorAction(
  state: Response,
  input: unknown
): Promise<Response> {
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
