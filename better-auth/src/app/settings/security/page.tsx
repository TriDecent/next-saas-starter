import {
  ChangePasswordCard,
  RequestPasswordResetCard,
} from '@/features/settings/security';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect(ROUTES.auth.href);

  return {
    ...ROUTES.settings.metadata,
    title: `${session.user.name}'s Security`,
  };
}

export default async function SecurityPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect(ROUTES.auth.href);

  const accounts = await auth.api.listUserAccounts({ headers: headersList });
  const hasCredentialAccount = accounts.some(
    account => account.providerId === 'credential'
  );

  return !hasCredentialAccount ? (
    <RequestPasswordResetCard email={session.user.email} />
  ) : (
    <ChangePasswordCard />
  );
}
