import {
  sendEmailVerification,
  sendPasswordResetEmail,
} from '@/features/email';
import { PrismaClient } from '@/generated/prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
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
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async data => {
      await sendPasswordResetEmail({
        to: data.user.email,
        userName: data.user.name,
        expireIn: '1h', // default, can be changed with resetPasswordTokenExpiresIn
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
        expireIn: '1h', // default, can be changed with expiresIn
        verificationUrl: data.url,
      });
    },
  },
});
