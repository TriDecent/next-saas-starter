import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();
export const auth = betterAuth({
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  emailAndPassword: { enabled: true },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
