'use client';

import { authClient } from '@/lib/auth';
import { ActionButton } from '@/shared/components';
import { useRouter } from 'next/navigation';
import { GoSignOut } from 'react-icons/go';

export function SignOutButton() {
  const router = useRouter();
  return (
    <ActionButton
      action={async () => {
        await authClient.signOut();
        router.refresh();
      }}
      variant={'outline'}
      size={'lg'}
    >
      Sign Out
      <GoSignOut />
    </ActionButton>
  );
}
