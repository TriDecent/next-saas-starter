import type { User } from '@/generated/prisma/client';
import { CopyText } from '@/shared/components/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import { Copy } from 'lucide-react';

export function CopyUserAction({ user }: { user: User }) {
  return (
    <DropdownMenuItem
      render={
        <CopyText
          onSuccess={'User ID copied to clipboard'}
          text={JSON.stringify(user)}
        >
          <Copy />
          Copy ID
        </CopyText>
      }
    />
  );
}
