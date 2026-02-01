import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';

import { FaArrowRight, FaPlus, FaUsers } from 'react-icons/fa';
import { CreateOrgModal } from './CreateOrgModal';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FaUsers className='text-muted-foreground size-4' />
          Quick actions
        </CardTitle>
        <CardDescription>Common organization tasks.</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <ItemGroup className='gap-3'>
          <CreateAnOrgItem />
          <InvitationsItem />
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function CreateAnOrgItem() {
  return (
    <CreateOrgModal>
      <Item variant='muted' className='hover:bg-muted cursor-pointer shadow'>
        <ItemMedia variant='icon' className='rounded-md'>
          <FaPlus />
        </ItemMedia>
        <ItemContent className='text-left'>
          <ItemTitle>Create an organization</ItemTitle>
          <ItemDescription>
            Start a new workspace for your team.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <FaArrowRight className='text-muted-foreground size-4' />
        </ItemActions>
      </Item>
    </CreateOrgModal>
  );
}

function InvitationsItem() {
  return (
    <Item variant='muted' className='hover:bg-muted cursor-pointer shadow'>
      <ItemMedia variant='icon' className='rounded-md'>
        <FaUsers />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Invitations</ItemTitle>
        <ItemDescription>Manage incoming and pending invites.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <FaArrowRight className='text-muted-foreground size-4' />
      </ItemActions>
    </Item>
  );
}
