import type { GetOrgResponse } from '@/services/organization';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { GrOverview } from 'react-icons/gr';
import { OrgIdentity } from './OrgIdentity';
import { QuickActions } from './QuickActions';

export type OrgOverviewProps = NonNullable<
  Extract<GetOrgResponse, { type: 'success' }>['payload']
>;

export function OrganizationOverview({ org }: { org: OrgOverviewProps }) {
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
      </CardHeader>

      <Separator />

      <CardContent className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <OrgIdentity
            org={org}
            members={org.members}
            pendingInvitesCount={pendingInvites.length}
          />
        </div>

        <QuickActions />
      </CardContent>
    </Card>
  );
}
