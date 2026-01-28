'use server';

import { getAuthService } from '@/infrastructure/service';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/security';
import { request } from '@arcjet/next';

export async function sendEmailVerificationAction(
  email: string,
  callbackURL: string
) {
  const decision = await ajEmailSend.protect(await request(), {
    action: 'sa-send-email-verification',
    emailId: `verify:${email}`,
    requested: 1,
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getAuthService();

  await service.sendVerificationEmail({ email, callbackURL });
}
