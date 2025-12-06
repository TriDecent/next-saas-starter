import { credentialsSchema } from '@/features/auth/action';
import z from 'zod';

export const basicAuthSchema = credentialsSchema.pick({ password: true });

export const totpAuthSchema = z.object({
  code: z.string().min(6).max(6),
});

export const twoFAAuthSchema = basicAuthSchema.extend(totpAuthSchema.shape);

export const backupCodeSchema = z.object({
  code: z.string().min(10).max(10),
});
