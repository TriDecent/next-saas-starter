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
import Link from 'next/link';

import { FaArrowRight, FaPlus, FaUsers } from 'react-icons/fa';

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
          <Item asChild variant='muted' className='cursor-pointer shadow'>
            <Link href='/organizations/new'>
              <ItemMedia variant='icon' className='rounded-md'>
                <FaPlus />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Create an organization</ItemTitle>
                <ItemDescription>
                  Start a new workspace for your team.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <FaArrowRight className='text-muted-foreground size-4' />
              </ItemActions>
            </Link>
          </Item>

          <Item asChild variant='muted' className='cursor-pointer shadow'>
            <Link href='/organizations/invitations'>
              <ItemMedia variant='icon' className='rounded-md'>
                <FaUsers />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Invitations</ItemTitle>
                <ItemDescription>
                  Manage incoming and pending invites.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <FaArrowRight className='text-muted-foreground size-4' />
              </ItemActions>
            </Link>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
