'use server';

import { getAuthService } from '@/services';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { UserDropdownNav } from './UserDropdownNav';

export async function Home() {
  const actor = (await getAuthService()).actor;

  return actor ? (
    <div className='mx-auto space-y-3'>
      <p className='text-muted-foreground'>
        You are signed in as{' '}
        <span className='text-foreground font-semibold'>{actor.name}</span>
      </p>

      <div className='flex flex-col items-center gap-2'>
        <UserDropdownNav user={actor} />
        <span className='text-muted-foreground text-xs'>
          Click on the avatar to open the menu
        </span>
      </div>
    </div>
  ) : (
    <Button
      variant={'default'}
      size={'lg'}
      nativeButton={false}
      render={<Link href={ROUTES.auth.href}>Sign In / Sign Up</Link>}
    />
  );
}
