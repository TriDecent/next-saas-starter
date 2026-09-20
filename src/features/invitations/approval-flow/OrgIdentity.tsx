import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import type { Invitation } from 'better-auth/plugins';
import { Clock3, ShieldCheck } from 'lucide-react';

type OrgEntityCardProps = {
  orgId: string;
  orgName: string;
  orgSlug: string;
  invitationStatus: Invitation['status'];
  invitationRole: Invitation['role'];
};

export function OrgEntityCard({
  orgId,
  orgName,
  orgSlug,
  invitationRole,
  invitationStatus,
}: OrgEntityCardProps) {
  return (
    <Card className='from-primary/1 via-primary/5 to-primary/15 border-none bg-transparent bg-linear-to-tl'>
      <CardHeader className='flex flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1'>
          <CardTitle className='text-xl'>{orgName}</CardTitle>
          <CardDescription>/{orgSlug}</CardDescription>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='outline' className='max-w-60 truncate font-mono'>
            <span className='truncate'>{orgId}</span>
          </Badge>
          <Badge variant={statusVariant(invitationStatus)}>
            <Clock3 className='mr-1' />
            {statusLabel(invitationStatus)}
          </Badge>
          <Badge>
            <ShieldCheck className='mr-1' />
            {roleLabel(invitationRole)}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}

function statusVariant(status: Invitation['status']) {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'accepted':
      return 'default';
    case 'rejected':
    case 'canceled':
      return 'destructive';
    default:
      return 'outline';
  }
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
