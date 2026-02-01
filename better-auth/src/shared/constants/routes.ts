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
        'Experience seamless authentication with Better Auth Demo. Sign in or register easily using email, password, or social login.',
      openGraph: {
        title: `Home | ${APP_NAME}`,
        description:
          'Experience seamless authentication with Better Auth Demo.',
        url: BASE_URL,
      },
    },
  }),
  admin: defineRoute({
    href: '/admin',
    metadata: {
      title: 'Admin Dashboard',
      description:
        'Access administrative controls and manage system settings, users, and configurations.',
      openGraph: {
        title: `Admin Dashboard | ${APP_NAME}`,
        description:
          'Access administrative controls and manage system settings.',
        url: `${BASE_URL}/admin`,
      },
      robots: {
        index: false,
        follow: false,
      },
    },
  }),
  organization: defineRoute({
    href: '/organization',
    metadata: {
      title: 'Organization',
      description:
        'Manage organization settings, members, roles, invitations, and security controls.',
      openGraph: {
        title: `Organization | ${APP_NAME}`,
        description:
          'Manage organization settings, members, roles, invitations, and security controls.',
        url: `${BASE_URL}/organization`,
        siteName: APP_NAME,
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Organization | ${APP_NAME}`,
        description:
          'Manage organization settings, members, roles, invitations, and security controls.',
      },
    },
  }),
  auth: defineRoute({
    href: '/auth',
    metadata: {
      title: 'Authentication',
      description:
        'Access your account or sign up with secure email/password authentication, email verification, password reset, and social login options.',
      openGraph: {
        title: `Authentication | ${APP_NAME}`,
        description: 'Access your account or sign up securely.',
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
          description: 'Easily reset your password to restore account access.',
        },
      }),
      'verify-2fa': defineRoute({
        href: '/auth/verify-2fa',
        metadata: {
          title: 'Two-Factor Authentication',
          description:
            'Secure your account with two-factor authentication options.',
        },
        nested: {
          authenticator: defineRoute({
            href: '/auth/verify-2fa/authenticator',
            metadata: {
              title: 'Authenticator Setup',
              description:
                'Set up an authenticator app for enhanced account security.',
            },
          }),
          'backup-codes': defineRoute({
            href: '/auth/verify-2fa/backup-codes',
            metadata: {
              title: 'Backup Codes',
              description:
                'Generate and manage backup codes for account recovery.',
            },
          }),
        },
      }),
    },
  }),
  settings: defineRoute({
    href: '/settings',
    metadata: {
      description:
        'Manage your profile, update personal details, and configure account preferences in one place.',
    },
    nested: {
      profile: defineRoute({
        href: '/settings/profile',
        metadata: {
          description:
            'Edit your user profile and keep your personal information up to date.',
        },
      }),
      security: defineRoute({
        href: '/settings/security',
        metadata: {
          description:
            'Enhance your account security by managing passwords and authentication methods.',
        },
      }),
      sessions: defineRoute({
        href: '/settings/sessions',
        metadata: {
          description:
            'Review and manage your active sessions and device logins.',
        },
      }),
      accounts: defineRoute({
        href: '/settings/accounts',
        metadata: {
          description:
            'Connect and manage linked accounts for seamless authentication.',
        },
      }),
      danger: defineRoute({
        href: '/settings/danger',
        metadata: {
          description:
            'Access advanced account actions, including account deletion and recovery options.',
        },
      }),
    },
  }),
  error: defineRoute({
    href: '/error',
    metadata: {
      title: 'Error',
      description:
        'An unexpected error occurred. Please try again or contact support if the issue persists.',
      openGraph: {
        title: `Error | ${APP_NAME}`,
        description: 'An unexpected error occurred.',
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
        'Sorry, the page you requested could not be found or may have been moved.',
      openGraph: {
        title: `404 - Page Not Found | ${APP_NAME}`,
        description: 'Sorry, the page you requested could not be found.',
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
