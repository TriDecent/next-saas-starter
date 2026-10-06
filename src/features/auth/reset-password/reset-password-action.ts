'use server';

import { ResetPasswordSchema } from '@/features/auth/schema';
import type { GeneralAuthResponse } from '@/features/auth/server';
import { getAuthService } from '@/infrastructure/composition/factory';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';

type Response = GeneralAuthResponse | { type: 'initial' };

export async function resetPasswordAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedResult = ResetPasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input data' } };

  const emailForPasswordReset = parsedResult.data.email;

  const resetPasswordDecision = await ajEmailSend.protect(await request(), {
    action: 'sa-reset-password',
    emailId: `${emailForPasswordReset}`,
    requested: 1,
  });

  if (resetPasswordDecision.isDenied())
    handleDeniedInServerAction(
      resetPasswordDecision,
      ROUTES.auth.nested['reset-password'].href
    );

  const service = await getAuthService();

  return service.requestResetPassword({
    email: emailForPasswordReset,
    redirectTo: ROUTES.auth.nested['reset-password'].href,
  });
}
