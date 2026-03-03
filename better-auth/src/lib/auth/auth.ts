import {
  sendChangeEmailVerification,
  sendDeleteAccountVerification,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '@/features/email';
import { ROUTES } from '@/shared/constants';
import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { prisma } from '../prisma';
import { organizationPluginConfigs } from './organization-permissions';
import { adminPluginConfigs } from './user-permissions';

export const auth = betterAuth({
  appName: 'Trí Decent Auth',
  advanced: { cookiePrefix: 'tri-decent' },
  impersonationSessionDuration: 60 * 60,
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  plugins: [
    twoFactor(),
    passkey({
      authenticatorSelection: { authenticatorAttachment: 'cross-platform' },
    }),
    admin(adminPluginConfigs),
    organization(organizationPluginConfigs),
    nextCookies(),
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: () => ({ welcomeSent: false, favoriteNumber: 0 }),
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      mapProfileToUser: () => ({ welcomeSent: false, favoriteNumber: 0 }),
    },
  },
  account: { accountLinking: { allowDifferentEmails: true } },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async data => {
      console.log(data.url);
      void sendPasswordResetEmail({
        to: data.user.email,
        userName: data.user.name,
        resetUrl: data.url,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async data => {
      console.log(data.url);
      void sendEmailVerification({
        to: data.user.email,
        userName: data.user.name,
        verificationUrl: data.url,
      });
    },
    // Send welcome email for email logins:
    afterEmailVerification: async user => {
      try {
        await prisma.user.update({
          where: { id: user.id, welcomeSent: false }, // Prevents repeated emails on subsequent verifications
          data: { welcomeSent: true },
        });

        await sendWelcomeEmail({ to: user.email, userName: user.name });
      } catch (error) {
        // Non-fatal error, ignore.
        // This will catch errors from `prisma.user.update` if the user
        // record was not found (i.e., welcomeSent was already true).
        // or from sendWelcomeEmail
        console.log(error);
      }
    },
  },
  user: {
    additionalFields: {
      welcomeSent: { type: 'boolean', required: true },
      favoriteNumber: { type: 'number', required: true },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async data => {
        console.log(data.url);
        await sendChangeEmailVerification({
          to: data.user.email,
          userName: data.user.name,
          verificationUrl: data.url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async data => {
        const safeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.settings.nested.danger.href}?token=${data.token}`;

        console.log(safeUrl);

        await sendDeleteAccountVerification({
          to: data.user.email,
          userName: data.user.name,
          verificationUrl: safeUrl,
        });
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Send welcome email for social logins
        after: async user => {
          if (!user.emailVerified || user.welcomeSent) return;

          try {
            await prisma.user.update({
              where: { id: user.id, welcomeSent: false }, // Prevents repeated emails on subsequent verifications
              data: { welcomeSent: true },
            });

            await sendWelcomeEmail({ to: user.email, userName: user.name });
          } catch (error) {
            console.log(error);
          }
        },
      },
    },
  },
});
