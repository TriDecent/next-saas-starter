import { SkeletonTable } from '@/shared/components';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Separator,
} from '@/shared/components/ui';
import { Suspense } from 'react';
import { FiMail, FiPlus, FiUsers } from 'react-icons/fi';
import type { OrganizationDetailsProps } from '../OrganizationDetails';
import { MembersTable } from './MembersTable';

export function MembersCard({
  members,
}: {
  members: OrganizationDetailsProps['members'];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          People who belong to this organization.
        </CardDescription>

        <CardAction>
          <Button className='gap-2'>
            <FiMail />
            Invite
          </Button>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className='mt-6'>
        {members.length === 0 ? (
          <EmptyMember />
        ) : (
          <Suspense fallback={<SkeletonTable />}>
            <MembersTable members={members} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyMember() {
  return (
    <Empty className='border'>
      <EmptyHeader>
        <EmptyMedia variant={'icon'}>
          <FiUsers className='size-5' />
        </EmptyMedia>
        <EmptyTitle>No members</EmptyTitle>
        <EmptyDescription>
          Add your first member to start collaborating.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='outline' className='gap-2'>
          <FiPlus className='size-4' />
          Add member
        </Button>
      </EmptyContent>
    </Empty>
  );
}
