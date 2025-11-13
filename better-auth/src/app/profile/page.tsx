import { ProfileCard } from '@/features/profile';
import { ROUTES } from '@/features/shared/constants';
import { prisma } from '@/lib';
import { auth } from '@/lib/auth';
import { LoaderPinwheel } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CgProfile } from 'react-icons/cg';

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSessionAndAccounts(await headers());

  return {
    ...ROUTES.profile.metadata,
    title: `${session.user.name}'s Profile`,
  };
}

export default async function ProfilePage() {
  const session = await getSessionAndAccounts(await headers());

  return (
    <section className='space-y-8'>
      <h2 className='flex items-center gap-2 text-2xl font-semibold tracking-wider'>
        <CgProfile className='text-primary text-3xl' />
        <span>My Profile</span>
      </h2>
      <Suspense fallback={<LoaderPinwheel className='animate-spin' />}>
        <ProfileCard {...session} />
      </Suspense>
    </section>
  );
}

async function getSessionAndAccounts(headers: Headers) {
  const session = await auth.api.getSession({ headers: headers });
  if (!session) redirect(ROUTES.auth.href);

  const accounts = (
    await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { accounts: true },
    })
  )?.accounts;

  return { ...session, accounts: accounts ?? [] };
}
