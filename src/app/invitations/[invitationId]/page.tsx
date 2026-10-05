import {
  InvitationApproval,
  InvitationDetails,
  OrgEntityCard,
} from '@/features/invitations';
import { getOrgService } from '@/infrastructure/composition/factory';
import { SectionHeader, SkeletonCard, SkeletonText } from '@/shared/components';
import { Card, CardContent } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { MdApproval } from 'react-icons/md';

export const metadata: Metadata =
  ROUTES.invitations.nested['approval-process'].metadata;

type Params = { invitationId: string };

export default async function ApprovalProcessPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <section className='space-y-6'>
      <SectionHeader
        icon={MdApproval}
        title='Invitation Approval'
        description='Review the invite details and decide to accept or decline the invitation.'
      />

      <Suspense fallback={<Skeleton />}>
        <Wrapper params={params} />
      </Suspense>
    </section>
  );
}

async function Wrapper({ params }: { params: Promise<Params> }) {
  const invitationId = (await params).invitationId;
  const service = await getOrgService(
    `${ROUTES.invitations.href}/${invitationId}`
  );

  const response = await service.getInvitation(invitationId);
  if (response.type === 'error') throw new Error(response.payload.message);

  const invitation = response.payload;

  return (
    <div className='space-y-6'>
      <OrgEntityCard
        orgId={invitation.organizationId}
        orgName={invitation.organizationName}
        orgSlug={invitation.organizationSlug}
        invitationStatus={invitation.status}
        invitationRole={invitation.role}
      />

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='space-y-6 md:col-span-2'>
          <InvitationDetails invitation={invitation} />
        </div>

        <div className='sticky top-32 h-fit space-y-6'>
          <InvitationApproval invitationId={invitation.id} />
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardContent>
          <SkeletonText />
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='space-y-6 md:col-span-2'>
          <SkeletonCard />
        </div>

        <div className='sticky top-32 h-fit space-y-6'>
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
