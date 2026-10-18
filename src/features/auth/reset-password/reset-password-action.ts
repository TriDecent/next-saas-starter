'use server';

import { ResetPasswordSchema } from '@/features/auth/schema';
import { getAuthService } from '@/infrastructure/composition/factory';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';

type ResetPasswordState = ActionState<void, { message: string }>;

export async function resetPasswordAction(
  state: ResetPasswordState,
  input: unknown
): Promise<ResetPasswordState> {
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
