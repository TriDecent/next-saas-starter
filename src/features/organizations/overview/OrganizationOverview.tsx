import type { GetOrgResponse } from '@/services/organization';
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { FaCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { GrOverview } from 'react-icons/gr';
import { OrgIdentity } from './OrgIdentity';

export type OrgOverviewProps = NonNullable<
  Extract<GetOrgResponse, { type: 'success' }>['payload']
>;

export function OrganizationOverview({
  org,
  isActive,
}: {
  org: OrgOverviewProps;
  isActive: boolean;
}) {
  const pendingInvites = org.invitations.filter(
    invitation => invitation.status === 'pending'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <GrOverview />
          Overview
        </CardTitle>
        <CardDescription>
          Organization details, members, and invitations.
        </CardDescription>

        <CardAction>
          <Badge variant={isActive ? 'success' : 'outline'}>
            {isActive ? (
              <FaCircleCheck className={`${isActive ? 'animate-pulse' : ''}`} />
            ) : (
              <FaRegCircleXmark />
            )}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        <div className='lg:col-span-2'>
          <OrgIdentity
            org={org}
            members={org.members}
            pendingInvitesCount={pendingInvites.length}
          />
        </div>
      </CardContent>
    </Card>
  );
}
