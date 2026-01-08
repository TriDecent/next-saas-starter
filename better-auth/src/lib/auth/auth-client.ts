import { passkeyClient } from '@better-auth/passkey/client';
import {
  adminClient,
  inferAdditionalFields,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from './auth';
import { adminPluginConfigs } from './permissions';

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    passkeyClient(),
    adminClient(adminPluginConfigs),
  ],
});
export const { signIn, signUp, useSession } = createAuthClient();
