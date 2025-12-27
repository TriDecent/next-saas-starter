import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export { authenticatePriorAction } from './authenticate-prior-action';
export { AuthenticatePriorContext } from './authenticate-prior-context';
export { AuthenticatePriorAction } from './AuthenticatePriorAction';
export { AuthenticatePriorProvider } from './AuthenticatePriorProvider';
export { verifySudoToken } from './sudo-mode';

export const SUDO_TOKEN_COOKIE = {
  name: 'sudo-token',
  config: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60,
  } satisfies Partial<ResponseCookie>,
} as const;
