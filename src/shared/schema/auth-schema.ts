// TODO: move feature-specific schemas to their respective modules.
// for now, nearly all schemas are kept here.

import z from 'zod';
import { credentialsSchema } from './';

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
