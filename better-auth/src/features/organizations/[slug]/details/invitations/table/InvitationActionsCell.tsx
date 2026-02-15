import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import type { Invitation } from 'better-auth/plugins';
import { MoreHorizontal } from 'lucide-react';
import { FaArrowRotateLeft, FaCopy } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

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

          <DropdownMenuItem>
            <FaCopy />
            Copy invite link
          </DropdownMenuItem>
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
