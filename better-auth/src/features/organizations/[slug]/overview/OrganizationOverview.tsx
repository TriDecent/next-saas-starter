import type { GetOrgResponse } from '@/infrastructure/service/organization';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';
import type { User } from 'better-auth';
import type { Member, Organization } from 'better-auth/plugins';
import { format } from 'date-fns';
import { CiEdit } from 'react-icons/ci';
import { FaBuilding, FaClock } from 'react-icons/fa6';
import { FiMail, FiPlus, FiUsers } from 'react-icons/fi';
import { GrOverview } from 'react-icons/gr';
import { Kpi } from '../_shared';

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

function OrgIdentity({
  org,
  members,
  pendingInvitesCount,
}: {
  org: Organization;
  members: (Member & { user: Pick<User, 'id' | 'email' | 'name' | 'image'> })[];
  pendingInvitesCount: number;
}) {
  return (
    <Card>
      <CardContent>
        <Item variant='outline' className='shadow'>
          <ItemMedia
            variant='icon'
            className='rounded-md text-xs font-semibold uppercase shadow'
          >
            {org.name.slice(0, 1)}
          </ItemMedia>

          <ItemContent className='w-full'>
            <ItemTitle className='w-full min-w-0'>
              <span className='truncate'>{org.name}</span>
            </ItemTitle>
            <ItemDescription className='truncate'>
              {`/${org.slug}`}
            </ItemDescription>
          </ItemContent>

          <ItemActions className='ml-auto'>
            <Button variant='outline' size='sm'>
              <CiEdit />
            </Button>
          </ItemActions>
        </Item>

        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <Kpi
            icon={<FiUsers />}
            label='Members'
            value={members.length.toString()}
          />
          <Kpi
            icon={<FiMail />}
            label='Pending invitations'
            value={pendingInvitesCount.toString()}
          />
          <Kpi
            icon={<FaClock />}
            label='Created'
            value={formatDate(org.createdAt)}
          />
          <Kpi
            icon={<FaBuilding className='size-4' />}
            label='Organization ID'
            value={org.id}
            mono
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm'>Quick actions</CardTitle>
        <CardDescription className='text-xs'>
          UI only. Wire actions later.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className='space-y-3'>
        <Button className='w-full justify-start' variant='outline'>
          <FiPlus className='size-4' />
          Add member
        </Button>
        <Button className='w-full justify-start' variant='outline'>
          <FiMail className='size-4' />
          Send invitation
        </Button>
        <Separator />
        <Button className='w-full justify-start' variant='outline'>
          <FaBuilding className='size-4' />
          Organization settings
        </Button>
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date) {
  return format(date, 'MMM dd, yyyy');
}
