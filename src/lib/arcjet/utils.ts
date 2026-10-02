import { type ArcjetDecision, type ArcjetEmailType } from '@arcjet/next';
import { redirect, RedirectType } from 'next/navigation';
import { NextResponse } from 'next/server';

import { ROUTES } from '@/shared/constants';

export function handleDeniedInServerAction(
  decision: ArcjetDecision,
  callbackUrl?: string
): never {
  const searchParams = new URLSearchParams();

  const message = decision.reason.isRateLimit()
    ? getRateLimitErrorMessage(decision)
    : decision.reason.isBot()
      ? 'Bot detected.'
      : decision.reason.isEmail()
        ? getEmailErrorMessage(decision.reason.emailTypes)
        : 'Forbidden';

  searchParams.set('message', message);
  searchParams.set('callbackUrl', callbackUrl ?? '/auth');

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
        error: getRateLimitErrorMessage(decision),
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

function getEmailErrorMessage(emailTypes: ArcjetEmailType[]): string {
  if (emailTypes.includes('INVALID')) return 'Email address format is invalid';
  if (emailTypes.includes('DISPOSABLE'))
    return 'Disposable email addresses are not allowed';

  if (emailTypes.includes('NO_MX_RECORDS')) return 'Email domain is not valid';
  return 'Invalid email';
}

function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return 'a moment';
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

function getRateLimitErrorMessage(decision: ArcjetDecision): string {
  const ttl = decision.ttl;
  if (typeof ttl === 'number' && ttl > 0) {
    return `Too many requests. Please try again in ${formatRemainingTime(ttl)}.`;
  }
  return 'Too many requests. Please try again later.';
}
