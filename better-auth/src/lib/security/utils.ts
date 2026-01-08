import { type ArcjetDecision, type ArcjetEmailType } from '@arcjet/next';
import { NextResponse } from 'next/server';

import { ROUTES } from '@/shared/constants';
import { redirect, RedirectType } from 'next/navigation';

export function handleDeniedInServerAction(
  decision: ArcjetDecision,
  callbackUrl?: string
) {
  const searchParams = new URLSearchParams();

  const message = decision.reason.isRateLimit()
    ? 'Too many requests. Please try again later.'
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
