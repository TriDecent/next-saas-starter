import { credentialsSchema } from '@/features/auth/action';
import z from 'zod';

export const basicAuthSchema = credentialsSchema.pick({ password: true });

export const twoFAAuthSchema = credentialsSchema
  .pick({ password: true })
  .extend({ code: z.string().min(6).max(6) });

export const backupCodeAuthSchema = z.object({
  code: z.string().min(10).max(10),
});
