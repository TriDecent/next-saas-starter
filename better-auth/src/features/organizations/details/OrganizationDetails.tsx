import { MySubscriptions, SubscriptionPlans } from '@/features/subscription';
import {
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { FaCreditCard } from 'react-icons/fa6';
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
      <ScrollArea className='mb-4 w-full min-w-2xs rounded-lg shadow'>
        <TabsList className='w-full'>
          <ScrollBar orientation='horizontal' />
          {settingsSections.map(section => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      <TabsContent value='members'>
        <MembersCard members={org.members} />
      </TabsContent>

      <TabsContent value='invitations'>
        <InvitationsCard invitations={org.invitations} />
      </TabsContent>

      <TabsContent value='metadata'>
        <MetadataCard metadata={org.metadata} slug={org.slug} />
      </TabsContent>

      <TabsContent value='danger'>
        <DeleteOrgItem orgId={org.id} />
      </TabsContent>

      <TabsContent value='subscription'>
        <MySubscriptions subscriptions={[]} />
        <SubscriptionPlans plans={[]} />
      </TabsContent>
    </Tabs>
  );
}

const settingsSections = [
  {
    value: 'members',
    label: (
      <>
        <HiUsers />
        Members
      </>
    ),
  },
  {
    value: 'invitations',
    label: (
      <>
        <HiEnvelope />
        Invitations
      </>
    ),
  },
  {
    value: 'metadata',
    label: (
      <>
        <HiCircleStack />
        Metadata
      </>
    ),
  },
  {
    value: 'subscription',
    label: (
      <>
        <FaCreditCard />
        Subscription
      </>
    ),
  },
  {
    value: 'danger',
    label: (
      <>
        <HiExclamationTriangle />
        Danger
      </>
    ),
  },
] as const;
