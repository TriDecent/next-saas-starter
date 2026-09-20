'use server';

import { getOrgService, getUserService } from '@/services';
import { SkeletonForm } from '@/shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  FieldSeparator,
  Separator,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { Suspense } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { InvitationSummary } from '../../summary';
import { BaseCreateInvitationForm } from '../_shared';
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
  const service = await getUserService(ROUTES.organizations.href);
  // * This implementation is not scalable.
  // *It fetches a hard-coded limit of the first 100 users,
  // * which will break with larger datasets.
  // * Consider implementing a client side combobox component with RTK query
  // * instead of fetching all users upfront.
  const response = await service.getUsers(0, 100);

  if (response.type === 'error') throw new Error(response.payload.message);

  return <SelectRecipient recipients={response.payload.users} />;
}
