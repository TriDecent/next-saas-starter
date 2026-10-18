import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import type { Organization } from 'better-auth/plugins';
import { CiEdit } from 'react-icons/ci';
import { FaBuilding, FaClock } from 'react-icons/fa6';
import { FiMail, FiUsers } from 'react-icons/fi';
import { Kpi } from '../components';
import { UpdateOrgModal } from '../update-org';
import { formatDate } from '../utils';

export function OrgIdentity({
  org,
  memberCount,
  pendingInvitesCount,
}: {
  org: Organization;
  memberCount: number;
  pendingInvitesCount: number;
}) {
  return (
    <>
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
          <UpdateOrgModal
            renderTrigger={
              <Button variant='outline' size='sm'>
                <CiEdit />
              </Button>
            }
          />
        </ItemActions>
      </Item>
      <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Kpi
          icon={<FiUsers />}
          label='Members'
          value={memberCount.toString()}
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
    </>
  );
}
