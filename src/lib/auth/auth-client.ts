import { passkeyClient } from '@better-auth/passkey/client';
import { stripeClient } from '@better-auth/stripe/client';
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { adminPluginConfigs } from './admin-plugin';
import { auth } from './auth';
import { organizationPluginConfigs } from './org-plugin';

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    passkeyClient(),
    adminClient(adminPluginConfigs),
    organizationClient(organizationPluginConfigs),
    stripeClient({ subscription: true }),
  ],
});
export const { signIn, signUp, useSession } = createAuthClient();
