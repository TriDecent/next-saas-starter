'use server';

import { auth } from '@/lib/auth';
import type { Session } from 'better-auth';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

export async function revokeSessionAction(token: Session['token']) {
  await auth.api.revokeSession({
    body: { token },
    headers: await headers(),
  });

  refresh();
}
