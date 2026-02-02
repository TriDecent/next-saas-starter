import {
  CreateInvitation,
  InvitationSummary,
} from '@/features/organizations/invitations';
import { getOrgService } from '@/infrastructure/service';
import { SectionHeader, SkeletonCard } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FcInvite } from 'react-icons/fc';

export const metadata: Metadata = ROUTES.invitations.metadata;

export default function InvitationsPage() {
  return (
    <section className='space-y-6'>
      <SectionHeader
        icon={FcInvite}
        title='Invitations'
        description='Manage your organization invitations and invite new members.'
      />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_0.75fr]'>
        <Suspense fallback={<SkeletonCard />}>
          <InvitationsWrapper />
        </Suspense>

        <aside className='space-y-4'>
          <InvitationSummary />
        </aside>
      </div>
    </section>
  );
}

async function InvitationsWrapper() {
  const service = await getOrgService(ROUTES.organization.href);
  const response = await service.listMyOrgs();

  if (response.type === 'error') throw new Error(response.payload.message);

  return <CreateInvitation organizations={response.payload} />;
}
