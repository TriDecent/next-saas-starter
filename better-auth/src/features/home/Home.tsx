'use client';

import { authClient } from '@/lib/auth-client';
import { LoaderPinwheelIcon } from 'lucide-react';
import Link from 'next/link';
import { ActionButton } from '../shared/components';
import { Button } from '../shared/components/ui';

export function Home() {
  const { data, isPending } = authClient.useSession();

  return isPending ? (
    <LoaderPinwheelIcon className='w-24 animate-spin' />
  ) : data?.session ? (
    <div className='flex flex-col items-center gap-y-4'>
      <p>You are signed in as {data.user.name}</p>
      <ActionButton
        action={async () => {
          await authClient.signOut();
        }}
        variant={'outline'}
        size={'lg'}
      >
        Sign Out
      </ActionButton>
    </div>
  ) : (
    <Button asChild variant={'outline'} size={'lg'}>
      <Link href={'/auth'}> Sign In / Sign Up</Link>
    </Button>
  );
}
