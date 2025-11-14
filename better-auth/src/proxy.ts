import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';

export const config: ProxyConfig = {
  matcher: ['/auth', '/'],
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === ROUTES.auth.href)
    return handleAuthPath(request);

  if (request.nextUrl.pathname === ROUTES.home.href) return NextResponse.next();

  return NextResponse.next();
}

export async function handleAuthPath(
  request: NextRequest
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session)
    return NextResponse.redirect(new URL(ROUTES.home.href, request.nextUrl));

  return NextResponse.next();
}
