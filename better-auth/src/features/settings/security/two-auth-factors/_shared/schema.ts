import { credentialsSchema } from '@/features/auth/action';
import z from 'zod';

export const basicAuthSchema = credentialsSchema.pick({ password: true });

export const twoFAAuthSchema = credentialsSchema
  .pick({ password: true })
  .extend({ code: z.string().min(6).max(6) });
