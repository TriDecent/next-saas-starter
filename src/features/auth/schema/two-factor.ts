import { z } from 'zod';
import { CredentialsSchema } from './auth';

const trustDeviceObject = { trustDevice: z.boolean().optional() };

export const BasicAuthSchema = CredentialsSchema.pick({ password: true });

export const TotpAuthSchema = z
  .object({ code: z.string().length(6) })
  .extend(trustDeviceObject);

export const TwoFAAuthSchema = BasicAuthSchema.extend(
  TotpAuthSchema.shape
).extend(trustDeviceObject);

export const BackupCodeSchema = z
  .object({ code: z.string().length(10) })
  .extend(trustDeviceObject);
