'use client';

import { ActionButton } from '@/features/shared/components';
import { Button } from '@/features/shared/components/ui';
import { authClient } from '@/lib/auth-client';
import { LoaderPinwheelIcon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data, isPending } = authClient.useSession();

  return (
    <section className='flex flex-col items-center gap-y-8'>
      <h2 className='text-xl font-medium tracking-wider'>
        Welcome to Better Auth Demo
      </h2>
      {isPending ? (
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
      )}
    </section>
  );
}
