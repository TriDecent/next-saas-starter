import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const COOKIES = {
  cookiePrefix: 'tri-decent',
  ['sudo-token']: {
    name: 'tri-decent.sudo-token',
    config: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60,
    } satisfies Partial<ResponseCookie>,
  },
} as const;
