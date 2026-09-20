import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import type { Invitation } from 'better-auth/plugins';
import { AcceptInvitationAction } from './AcceptInvitationAction';
import { RejectInvitationAction } from './RejectInvitationAction';

export function InvitationApproval({
  invitationId,
}: {
  invitationId: Invitation['id'];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Actions</CardTitle>
        <CardDescription>
          Accept or decline the invitation to join this organization.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <AcceptInvitationAction invitationId={invitationId} />
        <RejectInvitationAction invitationId={invitationId} />

        <Separator />

        <p className='text-muted-foreground text-center text-xs'>
          Some actions may be irreversible.
        </p>
      </CardContent>
    </Card>
  );
}
