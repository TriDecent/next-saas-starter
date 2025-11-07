import { PrismaClient } from '@/generated/prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

const prisma = new PrismaClient();

export const auth = betterAuth({
  advanced: { cookiePrefix: 'tri-decent' },
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
