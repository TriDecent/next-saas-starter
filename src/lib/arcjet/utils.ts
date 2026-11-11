import { type ArcjetDecision, type ArcjetEmailType } from '@arcjet/next';
import { redirect, RedirectType } from 'next/navigation';
import { NextResponse } from 'next/server';

import {
  getErrorDefinition,
  ROUTES,
  type AppErrorCode,
} from '@/shared/constants';

export function handleDeniedInServerAction(
  decision: ArcjetDecision,
  callbackUrl?: string
): never {
  const code = (
    decision.reason.isRateLimit()
      ? 'RATE_LIMITED'
      : decision.reason.isBot()
        ? 'BOT_DETECTED'
        : decision.reason.isEmail()
          ? getEmailErrorMessage(decision.reason.emailTypes)
          : 'FORBIDDEN'
  ) satisfies AppErrorCode;

  const searchParams = new URLSearchParams({
    code,
    ...(decision.reason.isRateLimit() && {
      details: getRateLimitErrorMessage(decision.ttl),
    }),
    ...(callbackUrl && { callbackUrl }),
  });

  redirect(
    `${ROUTES.error.href}?${searchParams.toString()}`,
    RedirectType.replace
  );
}

export function respondToDenial(decision: ArcjetDecision): NextResponse {
  if (decision.reason.isRateLimit()) {
    const ttl = decision.ttl;
    return NextResponse.json(
      {
        error: getRateLimitErrorMessage(ttl),
        retryAfter: ttl,
      },
      {
        status: 429,
        headers: { 'Retry-After': ttl.toString() },
      }
    );
  }

  if (decision.reason.isBot())
    return NextResponse.json({ error: 'Bot detected.' }, { status: 403 });

  if (decision.reason.isEmail()) {
    const message = getEmailErrorMessage(decision.reason.emailTypes);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

function getEmailErrorMessage(emailTypes: ArcjetEmailType[]): AppErrorCode {
  if (emailTypes.includes('DISPOSABLE'))
    return getErrorDefinition('DISPOSABLE_EMAIL').code;

  if (emailTypes.includes('FREE')) return getErrorDefinition('FREE_EMAIL').code;

  if (emailTypes.includes('NO_GRAVATAR'))
    return getErrorDefinition('NO_GRAVATAR').code;

  if (emailTypes.includes('NO_MX_RECORDS'))
    return getErrorDefinition('NO_MX_RECORDS').code;

  return getErrorDefinition('INVALID_EMAIL').code;
}

function formatRemainingTime(seconds: number): string {
  if (seconds <= 5) return 'a moment';
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

function getRateLimitErrorMessage(ttl: number): string {
  return `Too many requests. Please try again in ${formatRemainingTime(ttl)}.`;
}
