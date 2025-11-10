'use server';

import { auth } from '@/lib/auth';
import arcjet, { detectBot, request, slidingWindow } from '@arcjet/next';

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({ mode: 'LIVE', allow: [] }),
    slidingWindow({ mode: 'LIVE', max: 5, interval: '10m' }),
  ],
});

export async function sendEmailVerificationAction(email: string) {
  const decision = await aj.protect(await request());

  if (!decision.isDenied())
    return auth.api.sendVerificationEmail({ body: { email } });

  if (decision.reason.isRateLimit()) {
    throw new Error('Too many verification requests. Please try again later.');
  }

  if (decision.reason.isBot()) throw new Error('Bot detected.');

  throw new Error('Request denied.');
}
