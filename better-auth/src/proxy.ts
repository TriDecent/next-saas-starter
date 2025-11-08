import { checkArcjet } from '@/lib';
import type { ArcjetDecision, ArcjetEmailType } from '@arcjet/next';
import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';

export const config: ProxyConfig = {
  matcher: ['/api/auth/:path*', '/auth'],
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/auth'))
    return handleAuthApiPath(request);

  if (request.nextUrl.pathname.startsWith('/auth'))
    return handleAuthServerAction(request);

  return NextResponse.next();
}

export async function handleAuthApiPath(
  request: NextRequest
): Promise<NextResponse> {
  const decision = await checkArcjet(request);

  if (!decision.isDenied()) return NextResponse.next();

  return handleDeniedApiRequest(decision);
}

export async function handleAuthServerAction(
  request: NextRequest
): Promise<NextResponse> {
  if (request.method !== 'POST' || !request.headers.get('next-action'))
    return NextResponse.next();

  const decision = await checkArcjet(request);

  if (!decision.isDenied()) return NextResponse.next();

  return handleDeniedServerAction(decision, request);
}

function handleDeniedApiRequest(decision: ArcjetDecision): NextResponse {
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

function handleDeniedServerAction(
  decision: ArcjetDecision,
  request: NextRequest
): NextResponse {
  const url = new URL('/error', request.nextUrl);

  if (decision.reason.isRateLimit()) {
    url.searchParams.set(
      'message',
      'Too many requests. Please try again later.'
    );
  } else if (decision.reason.isBot()) {
    url.searchParams.set('message', 'Bot detected.');
  } else if (decision.reason.isEmail()) {
    url.searchParams.set(
      'message',
      getEmailErrorMessage(decision.reason.emailTypes)
    );
  } else {
    url.searchParams.set('message', 'Forbidden');
  }

  url.searchParams.set('callbackUrl', '/auth');

  const response = new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'x-action-redirect': url.href,
    },
  });

  return response;
}

function getEmailErrorMessage(emailTypes: ArcjetEmailType[]): string {
  if (emailTypes.includes('INVALID')) return 'Email address format is invalid';
  if (emailTypes.includes('DISPOSABLE'))
    return 'Disposable email addresses are not allowed';
  if (emailTypes.includes('NO_MX_RECORDS')) return 'Email domain is not valid';
  return 'Invalid email';
}
