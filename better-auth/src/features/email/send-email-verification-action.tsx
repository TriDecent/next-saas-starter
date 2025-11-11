'use server';

import { getAjForEmailVerification, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import { request } from '@arcjet/next';
import { headers } from 'next/headers';

export async function sendEmailVerificationAction(email: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    throw new Error('Authenticated users cannot request email verification');

  const decision = await getAjForEmailVerification().protect(await request(), {
    email,
    requested: 1,
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  await auth.api.sendVerificationEmail({ body: { email } });
}
