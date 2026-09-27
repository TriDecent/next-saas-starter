'use client';

import { UserSummary } from '@/shared/components';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { CellContext } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { TbArrowsExchange2 } from 'react-icons/tb';
import { useOrgContext } from '../../../context/client';
import { type GetFullOrg } from '../../_shared';
import { CopyMemberAction } from '../copy-member';
import { RemoveMemberAction } from '../remove-user/client';
import { UpdateRolesActions } from '../set-role';

export function MemberActionsCell({
  row,
}: CellContext<GetFullOrg['members'][number], unknown>) {
  const member = row.original;
  const user = member.user;
  const orgCtx = useOrgContext();

  const callbackUrl = `${ROUTES.organizations.href}/${orgCtx.slug}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>
          <UserSummary
            name={user.name}
            email={user.email}
            image={user.image ?? null}
            className='p-0'
            contentClassName='items-start'
          />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-muted-foreground text-xs'>
            Actions
          </DropdownMenuLabel>

          <CopyMemberAction member={member} />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TbArrowsExchange2 />
              Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <UpdateRolesActions member={member} callbackUrl={callbackUrl} />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-destructive text-xs font-bold'>
            Danger zone
          </DropdownMenuLabel>

          <RemoveMemberAction
            payload={{
              memberIdOrEmail: member.id,
              organizationId: member.organizationId,
            }}
            callbackUrl={callbackUrl}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
