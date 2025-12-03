'use server';

import { auth } from '@/lib/auth';
import { APIError, type Session } from 'better-auth';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

export async function revokeSessionAction(token: Session['token']) {
  try {
    await auth.api.revokeSession({ body: { token }, headers: await headers() });
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof APIError ? error.message : 'Unknown error'
    );
  }

  refresh();
}
