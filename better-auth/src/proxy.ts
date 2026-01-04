import { auth, ensureSessionFromRequest } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';

export const config: ProxyConfig = {
  matcher: ['/auth/:path*', '/settings/:path*', '/admin:path*'],
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(ROUTES.admin.href))
    return handleAdminPaths(request);

  if (request.nextUrl.pathname.startsWith(ROUTES.auth.href))
    return handleAuthPath(request);

  if (request.nextUrl.pathname.startsWith(ROUTES.settings.href))
    return handleSettingsPaths(request);

  return NextResponse.next();
}

async function handleAdminPaths(request: NextRequest) {
  return ensureSessionFromRequest(request);
}

// for the /auth route (login & register), do not use 's' here
async function handleAuthPath(request: NextRequest): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session)
    return NextResponse.redirect(new URL(ROUTES.home.href, request.nextUrl));

  return NextResponse.next();
}

async function handleSettingsPaths(
  request: NextRequest
): Promise<NextResponse> {
  if (request.nextUrl.pathname === ROUTES.settings.href)
    return NextResponse.redirect(
      new URL(ROUTES.settings.nested.profile.href, request.nextUrl)
    );

  return ensureSessionFromRequest(request);
}
