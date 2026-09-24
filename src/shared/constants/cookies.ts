import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const prefix = 'tri-decent';
export const COOKIES = {
  cookiePrefix: prefix,
  ['sudo-token']: {
    name: `${prefix}.sudo-token`,
    config: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 300,
    } satisfies Partial<ResponseCookie>,
  },
  ['admin-session']: { name: `${prefix}.admin_session` },
} as const;
