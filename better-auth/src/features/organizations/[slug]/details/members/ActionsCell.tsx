'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import type { CellContext } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';
import { TbArrowsExchange2 } from 'react-icons/tb';
import { useOrgContext } from '../../context';
import { UserSummary, type GetFullOrg } from '../_shared';
import { UpdateRoleAction } from './set-role';

export function ActionsCell({
  row,
}: CellContext<GetFullOrg['members'][number], unknown>) {
  const member = row.original;
  const user = member.user;
  const orgCtx = useOrgContext();

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

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TbArrowsExchange2 />
              Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <UpdateRoleAction
                memberId={member.id}
                organizationId={member.organizationId}
                organizationSlug={orgCtx.slug}
                role={'owner'}
                currentRoles={member.role}
              />
              <UpdateRoleAction
                memberId={member.id}
                organizationId={member.organizationId}
                organizationSlug={orgCtx.slug}
                role={'admin'}
                currentRoles={member.role}
              />
              <UpdateRoleAction
                memberId={member.id}
                organizationId={member.organizationId}
                organizationSlug={orgCtx.slug}
                role={'member'}
                currentRoles={member.role}
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-muted-foreground text-xs'>
            Danger zone
          </DropdownMenuLabel>

          <DropdownMenuItem className='text-destructive'>
            <FaTrash className='text-destructive' />
            Remove from org
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
