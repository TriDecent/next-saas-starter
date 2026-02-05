import { getOrgService } from '@/infrastructure/service';
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
import { InvitationSummary } from '../summary';
import { CreateInvitationForm } from './CreateInvitationForm';
import { SelectOrganization } from './SelectOrganization';
import { SelectRecipient } from './SelectRecipient';
import { SelectRole } from './SelectRole';

export function CreateInvitation() {
  return (
    <CreateInvitationForm>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_0.75fr]'>
        <CreateInvitationCard />

        <aside className='space-y-4'>
          <InvitationSummary />
        </aside>
      </div>
    </CreateInvitationForm>
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
            <Wrapper />
          </Suspense>

          <FieldSeparator />

          <SelectRecipient />

          <FieldSeparator />

          <SelectRole />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

async function Wrapper() {
  const service = await getOrgService(ROUTES.organization.href);
  const response = await service.listMyOrgs();

  if (response.type === 'error') throw new Error(response.payload.message);

  return <SelectOrganization organizations={response.payload} />;
}
