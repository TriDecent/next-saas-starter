import type { Organization } from '@/generated/prisma/client';
import { ROUTES } from '@/shared/constants';
import type { User } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';
import { auth } from './auth';

export const ensureSession = cache(
  async (headers: Headers, callbackUrl: string) => {
    const session = await auth.api.getSession({ headers });

    if (session) return session;

    const searchParams = new URLSearchParams({ callbackUrl });

    redirect(`${ROUTES.auth.href}?${searchParams.toString()}`);
  }
);

export const ensureSessionFromRequest = cache(
  async (request: NextRequest): Promise<NextResponse> => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (session) return NextResponse.next();

    const callbackUrl = `${request.nextUrl.pathname}?${request.nextUrl.searchParams.toString()}`;
    const redirectTo = new URL(ROUTES.auth.href, request.nextUrl);
    redirectTo.searchParams.set('callbackUrl', callbackUrl.toString());

    return NextResponse.redirect(redirectTo);
  }
);

export const hasPermission = cache(
  async (
    userId: User['id'],
    permissions: NonNullable<
      NonNullable<
        Parameters<typeof auth.api.userHasPermission>[0]
      >['body']['permissions']
    >
  ) => {
    const hasPermission = await auth.api.userHasPermission({
      body: { userId, permissions },
    });

    return hasPermission.success;
  }
);

export const hasOrganizationPermission = cache(
  async (
    {
      organizationId,
      permissions,
    }: {
      organizationId: Organization['id'];
      permissions: NonNullable<
        NonNullable<
          Parameters<typeof auth.api.hasPermission>[0]
        >['body']['permissions']
      >;
    },
    headers: ReadonlyHeaders
  ) => {
    const hasPermission = await auth.api.hasPermission({
      body: { organizationId, permissions },
      headers,
    });

    return hasPermission.success;
  }
);
