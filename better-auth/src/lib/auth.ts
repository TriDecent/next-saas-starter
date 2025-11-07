import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { PrismaClient } from '@/generated/prisma/client';
import { nextCookies } from 'better-auth/next-js';

const prisma = new PrismaClient();

export const auth = betterAuth({
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
