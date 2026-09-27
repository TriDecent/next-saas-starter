import { CopyText } from '@/shared/components/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import type { Member } from 'better-auth/plugins';
import { FiCopy } from 'react-icons/fi';

export function CopyMemberAction({ member }: { member: Member }) {
  return (
    <DropdownMenuItem asChild>
      <CopyText
        text={JSON.stringify(member)}
        onSuccess={'Member details copied to clipboard'}
      >
        <FiCopy />
        Copy
      </CopyText>
    </DropdownMenuItem>
  );
}
