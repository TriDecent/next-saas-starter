'use server';

import { getUsersInfiniteQueryOptions } from '@/features/user';
import { getQueryClient } from '@/lib/tanstack-query';
import { getOrgService, getUserService } from '@/services';
import { SkeletonForm } from '@/shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { FieldGroup, FieldSeparator } from '@/shared/components/ui/client';
import { ROUTES } from '@/shared/constants';
import { PAGINATION_DEFAULTS } from '@/shared/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { InvitationSummary } from '../../summary';
import { BaseCreateInvitationForm } from '../_shared/client';
import { SelectOrganization } from './SelectOrganization';
import { SelectRecipient } from './SelectRecipient';
import { SelectRole } from './SelectRole';

export async function CreateInvitationSinglePageForm() {
  return (
    <BaseCreateInvitationForm>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-8'>
        <div className='md:col-span-5'>
          <CreateInvitationCard />
        </div>

        <aside className='sticky top-24 h-fit space-y-4 md:col-span-3'>
          <InvitationSummary />
        </aside>
      </div>
    </BaseCreateInvitationForm>
  );
}

function CreateInvitationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FaUserPlus className='text-muted-foreground size-4' />
          Invite members
        </CardTitle>
        <CardDescription>
          Choose an organization, then send an invitation by email.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <FieldGroup>
          <Suspense fallback={<SkeletonForm />}>
            <SelectOrgWrapper />
          </Suspense>

          <FieldSeparator />

          <Suspense fallback={<SkeletonForm />}>
            <SelectRecipientWrapper />
          </Suspense>

          <FieldSeparator />

          <SelectRole />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

async function SelectOrgWrapper() {
  const service = await getOrgService(ROUTES.organizations.href);
  const response = await service.listMyOrgs();

  if (response.type === 'error') throw new Error(response.payload.message);

  return (
    <SelectOrganization
      organizations={response.payload}
      activeOrgId={service.getActiveOrgId()}
    />
  );
}

async function SelectRecipientWrapper() {
  const service = await getUserService(ROUTES.invitations.href);
  const response = await service.getUsers({
    page: PAGINATION_DEFAULTS.page,
    limit: PAGINATION_DEFAULTS.limit,
    orderBy: [{ email: 'asc' }],
  });

  if (response.type === 'error') throw new Error(response.payload.message);

  const queryClient = getQueryClient();
  queryClient.setQueryData(
    getUsersInfiniteQueryOptions({
      limit: PAGINATION_DEFAULTS.limit,
    }).queryKey,
    { pages: [response.payload], pageParams: [PAGINATION_DEFAULTS.page] }
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SelectRecipient />
    </HydrationBoundary>
  );
}
