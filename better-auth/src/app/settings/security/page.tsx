import { AuthenticatePriorProvider } from '@/features/auth/authenticate-prior';
import { PasskeysList } from '@/features/settings/security/passkey';
import {
  ChangePasswordCard,
  RequestPasswordResetCard,
} from '@/features/settings/security/password';
import { TwoFactorsCard } from '@/features/settings/security/two-auth-factors';
import { getUserService } from '@/infrastructure/service';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.security.href))
    .self;

  return {
    ...ROUTES.settings.nested.security.metadata,
    title: `${user.name}'s Security`,
  };
}

export default async function SecurityPage() {
  const service = await getUserService(ROUTES.settings.nested.security.href);

  const [accounts, passkeys] = await Promise.all([
    service.listMyAccounts(),
    service.listMyPasskey(),
  ]);
  const hasCredentialAccount = accounts.some(
    account => account.providerId === 'credential'
  );

  return !hasCredentialAccount ? (
    <RequestPasswordResetCard email={service.self.email} />
  ) : (
    <div className='space-y-8'>
      <AuthenticatePriorProvider user={service.self}>
        <TwoFactorsCard isEnabled={!!service.self.twoFactorEnabled} />
        <ChangePasswordCard />
        <PasskeysList passkeys={passkeys} />
      </AuthenticatePriorProvider>
    </div>
  );
}
