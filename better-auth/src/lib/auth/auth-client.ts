import { passkeyClient } from '@better-auth/passkey/client';
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from './auth';
import { organizationPluginConfigs } from './organization-permissions';
import { adminPluginConfigs } from './user-permissions';

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    passkeyClient(),
    adminClient(adminPluginConfigs),
    organizationClient(organizationPluginConfigs),
  ],
});
export const { signIn, signUp, useSession } = createAuthClient();
