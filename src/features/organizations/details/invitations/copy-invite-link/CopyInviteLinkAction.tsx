import { CopyText } from '@/shared/components/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Invitation } from 'better-auth/plugins';
import { IoCopy } from 'react-icons/io5';

export function CopyInviteLinkAction({
  invitation,
}: {
  invitation: Invitation;
}) {
  return (
    <DropdownMenuItem
      nativeButton={true}
      render={
        <CopyText
          text={`${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.invitations.href}/${invitation.id}`}
          onSuccess='Invite link copied to clipboard!'
        >
          <IoCopy />
          Copy link
        </CopyText>
      }
    ></DropdownMenuItem>
  );
}
