import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import type { Organization } from 'better-auth/plugins';
import { PiTrashSimpleFill } from 'react-icons/pi';
import { DeleteOrgAlert } from './DeleteOrgAlert';

export function DeleteOrgItem({ orgId }: { orgId: Organization['id'] }) {
  return (
    <Item variant={'muted'}>
      <ItemMedia
        variant='icon'
        className='border-destructive bg-destructive/20'
      >
        <PiTrashSimpleFill className='text-destructive' />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='text-destructive'>Delete Organization</ItemTitle>
        <ItemDescription>
          This action will permanently delete the organization and all
          associated data. This cannot be undone.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <DeleteOrgAlert orgId={orgId} />
      </ItemActions>
    </Item>
  );
}
