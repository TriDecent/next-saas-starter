import {
  ChangePasswordCard,
  RequestPasswordResetCard,
} from '@/features/settings/security/password';
import { TwoFactorsCard } from '@/features/settings/security/two-auth-factors';
import { auth, ensureSession } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

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

  const accounts = await auth.api.listUserAccounts({ headers: headersList });
  const hasCredentialAccount = accounts.some(
    account => account.providerId === 'credential'
  );

  return !hasCredentialAccount ? (
    <RequestPasswordResetCard email={session.user.email} />
  ) : (
    <div className='space-y-8'>
      <ChangePasswordCard />
      <TwoFactorsCard isEnabled={!!session.user.twoFactorEnabled} />
    </div>
  );
}
