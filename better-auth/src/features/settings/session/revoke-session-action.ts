'use server';

import { auth } from '@/lib/auth';
import { APIError, type Session } from 'better-auth';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

export async function revokeSessionAction(token: Session['token']) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    await auth.api.revokeSession({ body: { token }, headers: await headers() });
  } catch (error) {
    throw new Error(
      error instanceof APIError ? error.message : 'Unknown error'
    );
  }

  refresh();
}
