import { Metadata } from 'next';

type Route = {
  href: string;
  metadata: Metadata;
  nested?: Record<string, Route>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
const APP_NAME = 'Better Auth Demo';
const APP_DESCRIPTION =
  'A modern authentication demo built with Better Auth, Next.js, and Prisma. Features email verification, password reset, and social login.';

export const ROUTES = {
  root: defineRoute({
    href: '/',
    metadata: {
      title: {
        template: `%s | ${APP_NAME}`,
        default: APP_NAME,
      },
      description: APP_DESCRIPTION,
      metadataBase: new URL(BASE_URL),
      openGraph: {
        title: APP_NAME,
        description: APP_DESCRIPTION,
        url: BASE_URL,
        siteName: APP_NAME,
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: APP_NAME,
        description: APP_DESCRIPTION,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    },
  }),
  home: defineRoute({
    href: '/',
    metadata: {
      title: 'Home',
      description:
        'Welcome to Better Auth Demo. Sign in to your account or create a new one with email verification and social login support.',
      openGraph: {
        title: `Home | ${APP_NAME}`,
        description: 'Welcome to Better Auth Demo',
        url: BASE_URL,
      },
    },
  }),
  auth: defineRoute({
    href: '/auth',
    metadata: {
      title: 'Authentication',
      description:
        'Sign in to your account or create a new one. Supports email/password authentication with verification, password reset, and social login with GitHub and Discord.',
      openGraph: {
        title: `Authentication | ${APP_NAME}`,
        description: 'Sign in or create your account',
        url: `${BASE_URL}/auth`,
      },
      robots: {
        index: false,
        follow: true,
      },
    },
    nested: {
      ['reset-password']: defineRoute({
        href: '/auth/reset-password',
        metadata: {
          title: 'Reset my password',
          description: 'Reset your password to regain access to your account.',
        },
      }),
    },
  }),
  profile: defineRoute({
    href: '/profile',
    metadata: {
      description:
        'View and manage your user profile, update personal information, and review account settings.',
    },
  }),
  error: defineRoute({
    href: '/error',
    metadata: {
      title: 'Error',
      description: 'An error occurred. Please try again or contact support.',
      openGraph: {
        title: `Error | ${APP_NAME}`,
        description: 'Something went wrong',
        url: `${BASE_URL}/error`,
      },
      robots: {
        index: false,
        follow: false,
      },
    },
  }),
  ['not-found']: defineRoute({
    href: '/not-found',
    metadata: {
      title: 'Page Not Found',
      description:
        'The page you are looking for does not exist or has been moved.',
      openGraph: {
        title: `404 - Page Not Found | ${APP_NAME}`,
        description: 'The page you are looking for could not be found.',
      },
      robots: {
        index: false,
        follow: false,
      },
    },
  }),
} as const;

function defineRoute<T extends Route>(route: T): T {
  return route;
}
