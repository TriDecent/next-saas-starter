import { AuthenticatePriorProvider } from '@/features/auth';
import {
  ChangePasswordCard,
  PasskeysList,
  RequestPasswordResetCard,
  TwoFactorsCard,
} from '@/features/settings';
import { getUserService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.security.href))
    .actor;

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
    <RequestPasswordResetCard email={service.actor.email} />
  ) : (
    <div className='space-y-8'>
      <AuthenticatePriorProvider user={service.actor}>
        <TwoFactorsCard isEnabled={!!service.actor.twoFactorEnabled} />
        <ChangePasswordCard />
        <PasskeysList passkeys={passkeys} />
      </AuthenticatePriorProvider>
    </div>
  );
}
