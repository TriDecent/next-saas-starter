'use server';

import { MySubscriptions, SubscriptionPlans } from '@/features/subscription';
import { getSubscriptionService } from '@/services';
import { Loading } from '@/shared/components';
import {
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { Suspense } from 'react';
import { FaCreditCard } from 'react-icons/fa6';
import {
  HiCircleStack,
  HiEnvelope,
  HiExclamationTriangle,
  HiUsers,
} from 'react-icons/hi2';
import { OrgContextProvider } from '../context';
import { DeleteOrgItem } from '../delete-org';
import type { GetFullOrg } from './_shared';
import { InvitationsCard } from './invitations';
import { MembersCard } from './members';
import { MetadataCard } from './metadata';

export type OrganizationDetailsProps = { org: GetFullOrg; callbackUrl: string };

export async function OrganizationDetails({
  org,
  callbackUrl,
}: OrganizationDetailsProps) {
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

      <TabsContent value='subscription' className='space-y-8'>
        <Suspense fallback={<Loading />}>
          <Subscriptions org={org} callbackUrl={callbackUrl} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

async function Subscriptions({
  org,
  callbackUrl,
}: {
  org: Pick<OrganizationDetailsProps, 'org'>['org'];
  callbackUrl: string;
}) {
  const service = await getSubscriptionService(callbackUrl);
  const response = await service.getSubscriptionOverview({
    customerType: 'organization',
    referenceId: org.id,
  });

  if (response.type === 'error') throw new Error(response.payload.message);

  return (
    <OrgContextProvider value={{ ...org }}>
      <MySubscriptions subscriptions={response.payload.activeSubscriptions} />
      <SubscriptionPlans
        plans={response.payload.plans}
        currentPlan={response.payload.currentPlan}
      />
    </OrgContextProvider>
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
