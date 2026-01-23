'use client';

import type { User } from '@/generated/prisma/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export function CopyUserAction({ user }: { user: User }) {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await navigator.clipboard.writeText(user.id);
        toast.success('User ID copied to clipboard');
      }}
    >
      <Copy className='mr-2 h-4 w-4' />
      Copy ID
    </DropdownMenuItem>
  );
}
