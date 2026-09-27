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
import type { Invitation } from 'better-auth/plugins';
import { FiMail } from 'react-icons/fi';
import { InvitationsTable } from './table/client';

export function InvitationsCard({
  invitations,
}: {
  invitations: Invitation[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <CardDescription>
          Pending and past invitations sent for this organization.
        </CardDescription>

        <CardAction>
          <Button className='gap-2'>
            <FiMail />
            Invite
          </Button>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        {invitations.length === 0 ? (
          <EmptyInvitation />
        ) : (
          <InvitationsTable invitations={invitations} />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyInvitation() {
  return (
    <Empty className='border'>
      <EmptyMedia variant={'icon'}>
        <FiMail />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No invitations</EmptyTitle>
        <EmptyDescription>
          Invite people by email to join this organization.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='outline' className='gap-2'>
          <FiMail className='size-4' />
          Send invitation
        </Button>
      </EmptyContent>
    </Empty>
  );
}
