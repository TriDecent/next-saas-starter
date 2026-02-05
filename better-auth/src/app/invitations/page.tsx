import { CreateInvitation } from '@/features/organizations/invitations/create-invitation';
import { SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
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

      <CreateInvitation />
    </section>
  );
}
