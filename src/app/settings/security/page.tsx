import { AuthenticatePriorServerBoundary } from '@/features/auth';
import { ChangeEmailCard } from '@/features/auth/change-email';
import {
  PasskeysList,
  RequestPasswordResetCard,
  TwoFactorsCard,
} from '@/features/settings';
import { ChangePasswordCard } from '@/features/settings/security/password/client';
import { getUserService } from '@/infrastructure/composition/factory';
import { SkeletonCard } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.security.href))
    .actor;

  return {
    ...ROUTES.settings.nested.security.metadata,
    title: `${user.name}'s Security`,
  };
}

export default async function SecurityPage() {
  return (
    <Suspense fallback={<SecurityPageSkeleton />}>
      <SecurityContent />
    </Suspense>
  );
}

async function SecurityContent() {
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
      <AuthenticatePriorServerBoundary user={service.actor}>
        <TwoFactorsCard isEnabled={!!service.actor.twoFactorEnabled} />
        <div className='flex flex-col gap-x-4 gap-y-8 sm:flex-row'>
          <ChangePasswordCard className='flex-1' />
          <ChangeEmailCard className='flex-1' />
        </div>
        <PasskeysList passkeys={passkeys} />
      </AuthenticatePriorServerBoundary>
    </div>
  );
}

function SecurityPageSkeleton() {
  return (
    <div className='space-y-8'>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
