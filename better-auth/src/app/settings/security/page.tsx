import {
  AuthenticatePriorProvider,
  SUDO_TOKEN_COOKIE,
} from '@/features/auth/authenticate-prior';
import { PasskeysList } from '@/features/settings/security/passkey';
import {
  ChangePasswordCard,
  RequestPasswordResetCard,
} from '@/features/settings/security/password';
import { TwoFactorsCard } from '@/features/settings/security/two-auth-factors';
import { auth, ensureSession } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const session = await ensureSession(
    await headers(),
    ROUTES.settings.nested.security.href
  );

  return {
    ...ROUTES.settings.nested.security.metadata,
    title: `${session.user.name}'s Security`,
  };
}

export default async function SecurityPage() {
  const headersList = await headers();
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const [accounts, passkeys, cookiesList] = await Promise.all([
    auth.api.listUserAccounts({ headers: headersList }),
    auth.api.listPasskeys({ headers: headersList }),
    cookies(),
  ]);
  const hasCredentialAccount = accounts.some(
    account => account.providerId === 'credential'
  );

  return !hasCredentialAccount ? (
    <RequestPasswordResetCard email={session.user.email} />
  ) : (
    <div className='space-y-8'>
      <ChangePasswordCard />
      <TwoFactorsCard isEnabled={!!session.user.twoFactorEnabled} />
      <AuthenticatePriorProvider
        value={{
          is2FAEnabled: !!session.user.twoFactorEnabled,
          doesSudoTokenExist: cookiesList.has(SUDO_TOKEN_COOKIE.name),
        }}
      >
        <PasskeysList passkeys={passkeys} />
      </AuthenticatePriorProvider>
    </div>
  );
}
