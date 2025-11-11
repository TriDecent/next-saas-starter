import {
  detectBot,
  protectSignup,
  slidingWindow,
  tokenBucket,
  type ArcjetDecision,
  type ArcjetEmailType,
} from '@arcjet/next';
import { NextResponse } from 'next/server';

import arcjet, {
  shield,
  type BotOptions,
  type EmailOptions,
  type SlidingWindowRateLimitOptions,
} from '@arcjet/next';
import { redirect, RedirectType } from 'next/navigation';

// Authenticated users - track by userId only
const ajForAuthenticatedUser = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['userId'],
  rules: [shield({ mode: 'LIVE' })],
});

// Anonymous users - track by IP only
const ajForAnonymousUser = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['ip.src'], // by default, not needed
  rules: [shield({ mode: 'LIVE' })],
});

export const botSettings: BotOptions = {
  mode: 'LIVE',
  allow: [],
};

export const restrictiveRateLimitSettings: SlidingWindowRateLimitOptions<[]> = {
  mode: 'LIVE',
  max: 10,
  interval: '10m',
};

export const laxRateLimitSettings: SlidingWindowRateLimitOptions<[]> = {
  mode: 'LIVE',
  max: 30,
  interval: '1m',
};

export const emailSettings: EmailOptions = {
  mode: 'LIVE',
  deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
};

export function getLaxAjForAuthenticatedUser() {
  return ajForAuthenticatedUser
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings));
}

export function getRestrictiveAjForAuthenticatedUser() {
  return ajForAuthenticatedUser
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(restrictiveRateLimitSettings));
}

export function getLaxAjForAnonymousUser() {
  return ajForAnonymousUser
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings));
}

export function getRestrictiveAjForAnonymousUser() {
  return ajForAnonymousUser
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(restrictiveRateLimitSettings));
}

export function getRestrictiveAjForGuestUserToSignUp() {
  return ajForAnonymousUser.withRule(
    protectSignup({
      email: emailSettings,
      bots: botSettings,
      rateLimit: restrictiveRateLimitSettings,
    })
  );
}

export function getAjForEmailVerificationOrPasswordResetEmail() {
  return ajForAnonymousUser.withRule(detectBot(botSettings)).withRule(
    tokenBucket({
      mode: 'LIVE',
      capacity: 3,
      refillRate: 1,
      interval: '1h',
      characteristics: ['email'],
    })
  );
}

export function handleDeniedInServerAction(decision: ArcjetDecision) {
  const searchParams = new URLSearchParams();

  const message = decision.reason.isRateLimit()
    ? 'Too many requests. Please try again later.'
    : decision.reason.isBot()
      ? 'Bot detected.'
      : decision.reason.isEmail()
        ? getEmailErrorMessage(decision.reason.emailTypes)
        : 'Forbidden';

  searchParams.set('message', message);
  searchParams.set('callbackUrl', '/auth');

  redirect(`error?${searchParams.toString()}`, RedirectType.replace);
}

export function respondToDenial(decision: ArcjetDecision): NextResponse {
  if (decision.reason.isRateLimit())
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );

  if (decision.reason.isBot())
    return NextResponse.json({ error: 'Bot detected.' }, { status: 403 });

  if (decision.reason.isEmail()) {
    const message = getEmailErrorMessage(decision.reason.emailTypes);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

function getEmailErrorMessage(emailTypes: ArcjetEmailType[]): string {
  if (emailTypes.includes('INVALID')) return 'Email address format is invalid';
  if (emailTypes.includes('DISPOSABLE'))
    return 'Disposable email addresses are not allowed';
  if (emailTypes.includes('NO_MX_RECORDS')) return 'Email domain is not valid';
  return 'Invalid email';
}
