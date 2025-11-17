import {
  sendChangeEmailVerification,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '@/features/email';
import { PrismaClient } from '@/generated/prisma/client';
import { ROUTES } from '@/shared/constants';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const auth = betterAuth({
  advanced: { cookiePrefix: 'tri-decent' },
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  plugins: [nextCookies()],
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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async data => {
      await sendPasswordResetEmail({
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
      await sendEmailVerification({
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
      sendChangeEmailVerification: async data => {
        await sendChangeEmailVerification({
          to: data.user.email,
          userName: data.user.name,
          verificationUrl: data.url,
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

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function ensureSession(headers: Headers, callbackUrl: string) {
  const session = await auth.api.getSession({ headers });

  if (session) return session;

  const searchParams = new URLSearchParams({ callbackUrl });

  redirect(`${ROUTES.auth.href}?${searchParams.toString()}`);
}
