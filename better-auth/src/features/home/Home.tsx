import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import { ActionButton } from '@/features/shared/components';
import { Button } from '@/features/shared/components/ui';
import Link from 'next/link';

export async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return session ? (
    <div className='flex flex-col items-center gap-y-4'>
      <p>You are signed in as {session.user.name}</p>
      <ActionButton
        action={async () => {
          'use server';
          await auth.api.signOut({ headers: await headers() });
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
