'use server';

import { ajEmailSend, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import { request } from '@arcjet/next';
import { headers } from 'next/headers';

export async function sendEmailVerificationAction(
  email: string,
  callbackURL: string
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && session.user.email !== email)
    throw new Error('You can only send verification emails to your own email.');

  const decision = await ajEmailSend.protect(await request(), {
    action: 'sa-send-email-verification',
    emailId: `verify:${email}`,
    requested: 1,
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  await auth.api.sendVerificationEmail({ body: { email, callbackURL } });
}
