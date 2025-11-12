import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import { Button } from '@/features/shared/components/ui';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';

export async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return session ? (
    <div className='flex flex-col items-center gap-y-4'>
      <p>You are signed in as {session.user.name}</p>
      {/*  IdkW this doesn't work as expected */}
      {/* <ActionButton
        action={async () => {
          'use server';
          await auth.api.signOut({ headers: await headers() });
          refresh();
        }}
        variant={'outline'}
        size={'lg'}
      >
        Sign Out
      </ActionButton> */}
      <SignOutButton />
    </div>
  ) : (
    <Button asChild variant={'outline'} size={'lg'}>
      <Link href={'/auth'}> Sign In / Sign Up</Link>
    </Button>
  );
}
