import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';

export const config: ProxyConfig = {
  matcher: ['/auth/:path*'],
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === ROUTES.auth.href)
    return handleAuthPath(request);

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
