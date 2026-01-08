import { auth, hasPermission } from '@/lib/auth';
import { Button, ButtonGroup } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { User } from 'better-auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
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

      <ButtonGroup>
        <Button variant={'outline'} size={'lg'} asChild>
          <Link href={ROUTES.settings.href}>
            <CgProfile />
            Profile
          </Link>
        </Button>

        <RenderAdminButton userId={session.user.id} />

        <SignOutButton />
      </ButtonGroup>
    </div>
  ) : (
    <Button asChild variant={'outline'} size={'lg'}>
      <Link href={'/auth'}> Sign In / Sign Up</Link>
    </Button>
  );
}

async function RenderAdminButton({ userId }: { userId: User['id'] }) {
  const canAccessAdmin = await hasPermission(userId, { admin: ['access'] });

  return canAccessAdmin ? <AdminButton /> : null;
}

function AdminButton() {
  return (
    <Button variant={'outline'} size={'lg'} asChild>
      <Link href={ROUTES.admin.href}>
        <MdOutlineAdminPanelSettings />
        Admin
      </Link>
    </Button>
  );
}
