import {
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import {
  HiCircleStack,
  HiEnvelope,
  HiExclamationTriangle,
  HiUsers,
} from 'react-icons/hi2';
import { DeleteOrgItem } from '../delete-org';
import type { GetFullOrg } from './_shared';
import { InvitationsCard } from './invitations';
import { MembersCard } from './members';
import { MetadataCard } from './metadata';

export type OrganizationDetailsProps = { org: GetFullOrg };

export function OrganizationDetails({ org }: OrganizationDetailsProps) {
  return (
    <Tabs defaultValue='members' className='w-full'>
      <ScrollArea className='w-full min-w-2xs rounded-lg shadow'>
        <TabsList className='w-full'>
          <ScrollBar orientation='horizontal' />
          <TabsTrigger value='members'>
            <HiUsers />
            Members
          </TabsTrigger>
          <TabsTrigger value='invitations'>
            <HiEnvelope />
            Invitations
          </TabsTrigger>
          <TabsTrigger value='metadata'>
            <HiCircleStack />
            Metadata
          </TabsTrigger>
          <TabsTrigger value='danger'>
            <HiExclamationTriangle />
            Danger
          </TabsTrigger>
        </TabsList>
      </ScrollArea>

      <TabsContent value='members' className='mt-4'>
        <MembersCard members={org.members} />
      </TabsContent>

      <TabsContent value='invitations' className='mt-4'>
        <InvitationsCard invitations={org.invitations} />
      </TabsContent>

      <TabsContent value='metadata' className='mt-4'>
        <MetadataCard metadata={org.metadata} slug={org.slug} />
      </TabsContent>

      <TabsContent value='danger' className='mt-4'>
        <DeleteOrgItem orgId={org.id} />
      </TabsContent>
    </Tabs>
  );
}
