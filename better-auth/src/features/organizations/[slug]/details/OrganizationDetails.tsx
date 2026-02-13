import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import type { GetFullOrg } from './_shared';
import { InvitationsCard } from './invitations';
import { MembersCard } from './members';
import { MetadataCard } from './metadata';

export type OrganizationDetailsProps = { org: GetFullOrg };

export function OrganizationDetails({ org }: OrganizationDetailsProps) {
  return (
    <Tabs defaultValue='members' className='w-full'>
      <TabsList className='w-full'>
        <TabsTrigger value='members'>Members</TabsTrigger>
        <TabsTrigger value='invitations'>Invitations</TabsTrigger>
        <TabsTrigger value='metadata'>Metadata</TabsTrigger>
      </TabsList>

      <TabsContent value='members' className='mt-4'>
        <MembersCard members={org.members} />
      </TabsContent>

      <TabsContent value='invitations' className='mt-4'>
        <InvitationsCard invitations={org.invitations} />
      </TabsContent>

      <TabsContent value='metadata' className='mt-4'>
        <MetadataCard metadata={org.metadata} slug={org.slug} />
      </TabsContent>
    </Tabs>
  );
}
