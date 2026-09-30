import type { PasskeyOptions } from '@better-auth/passkey';
import { ENV } from '../env';

export const passKeyOptions = {
  authenticatorSelection: { authenticatorAttachment: undefined },
  rpName: ENV.PASSKEY_RP_NAME,
  rpID: ENV.PASSKEY_RP_ID,
  origin: ENV.PASSKEY_ORIGIN,
} satisfies PasskeyOptions;
