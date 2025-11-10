import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

export const config: ProxyConfig = {
  matcher: ['/auth'],
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/auth'))
    return handleAuthPath(request);

  return NextResponse.next();
}

export async function handleAuthPath(
  request: NextRequest
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) return NextResponse.redirect(new URL('/', request.nextUrl));

  return NextResponse.next();
}
