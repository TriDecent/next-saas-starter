import { credentialsSchema } from '@/features/auth/action';
import z from 'zod';

const trustDeviceObj = { trustDevice: z.boolean().optional() };

export const basicAuthSchema = credentialsSchema.pick({ password: true });

export const totpAuthSchema = z
  .object({ code: z.string().length(6) })
  .extend(trustDeviceObj);

export const twoFAAuthSchema = basicAuthSchema
  .extend(totpAuthSchema.shape)
  .extend(trustDeviceObj);

export const backupCodeSchema = z
  .object({ code: z.string().length(10) })
  .extend(trustDeviceObj);
