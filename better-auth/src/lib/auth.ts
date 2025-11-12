import {
  sendEmailVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '@/features/email';
import { PrismaClient } from '@/generated/prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';

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
      mapProfileToUser: () => ({ welcomeSent: false }),
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      mapProfileToUser: () => ({ welcomeSent: false }),
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
  },
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if (
        !ctx.context.newSession ||
        // This 'welcomeSent' check is unreliable due to the 5-min session cache
        ctx.context.newSession.user.welcomeSent ||
        ctx.path.endsWith('/verify-email')
      )
        return;

      try {
        const { email, name, id } = ctx.context.newSession.user;

        // NOTE: The session is cached in cookies for 5 minutes (session.cookieCache).
        // This means `ctx.context.newSession.user.welcomeSent` will be stale (false)
        // on subsequent requests within that 5-minute window, even after the
        // database is updated.
        //
        // The `where: { welcomeSent: false }` clause below acts as an atomic
        // check. It ensures this update (and the subsequent email) only runs
        // once by throwing an error if the flag is already `true`.
        await prisma.user.update({
          where: { id, welcomeSent: false }, // this stop sending email
          data: { welcomeSent: true },
        });

        await sendWelcomeEmail({ to: email, userName: name });
      } catch {
        // Non-fatal error, ignore.
        // This will catch errors from `prisma.user.update` if the user
        // record was not found (i.e., welcomeSent was already true).
      }
    }),
  },
  user: {
    additionalFields: { welcomeSent: { type: 'boolean', required: true } },
  },
});
