import { findIp } from '@arcjet/ip';

import arcjet, {
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type SlidingWindowRateLimitOptions,
} from '@arcjet/next';
import type { NextRequest } from 'next/server';

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['userIdOrIp'],
  rules: [shield({ mode: 'LIVE' })],
});

const botSettings: BotOptions = {
  mode: 'LIVE',
  allow: [],
};

const restrictiveRateLimitSettings: SlidingWindowRateLimitOptions<[]> = {
  mode: 'LIVE',
  max: 10,
  interval: '10m',
};

const laxRateLimitSettings: SlidingWindowRateLimitOptions<[]> = {
  mode: 'LIVE',
  max: 2,
  interval: '1m',
};

const emailSettings: EmailOptions = {
  mode: 'LIVE',
  deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
};

export async function checkArcjet(
  request: NextRequest
): Promise<ArcjetDecision> {
  const body: unknown = await request
    .clone()
    .json()
    .catch(() => ({}));

  const ip = findIp(request);
  const userIdOrIp = ip ? ip : '127.0.0.1';

  if (request.url.endsWith('/auth/sign-up')) {
    if (
      body &&
      typeof body === 'object' &&
      'email' in body &&
      typeof body.email === 'string'
    )
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(request, { email: body.email, userIdOrIp });

    return aj
      .withRule(detectBot(botSettings))
      .withRule(slidingWindow(restrictiveRateLimitSettings))
      .protect(request, { userIdOrIp });
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp });
}
