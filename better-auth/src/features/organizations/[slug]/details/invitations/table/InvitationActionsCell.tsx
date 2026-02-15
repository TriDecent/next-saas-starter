import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import type { Invitation } from 'better-auth/plugins';
import { MoreHorizontal } from 'lucide-react';
import { MdEmail } from 'react-icons/md';
import { CancelInvitationAction } from '../cancel-invitation';
import { CopyInviteLinkAction } from '../copy-invite-link';

export function InvitationActionsCell({
  invitation,
}: {
  invitation: Invitation;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='flex max-w-52 items-center gap-2 truncate'>
          <MdEmail /> {invitation.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-muted-foreground text-xs'>
            Actions
          </DropdownMenuLabel>

          <CopyInviteLinkAction invitation={invitation} />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-muted-foreground text-xs'>
            Danger zone
          </DropdownMenuLabel>

          <DropdownMenuItem className='text-destructive'>
            <FaArrowRotateLeft className='text-destructive' />
            Revoke
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
