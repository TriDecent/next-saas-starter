import { ProfileCard } from '@/features/settings';
import { prisma } from '@/lib';
import { auth } from '@/lib/auth';
import { MiniLoader } from '@/shared/components';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaLink } from 'react-icons/fa6';
import { IoKey, IoPerson, IoShield, IoTrashBin } from 'react-icons/io5';

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSessionAndAccounts(await headers());

  return {
    ...ROUTES.profile.metadata,
    title: `${session.user.name}'s Settings`,
  };
}

export default async function SettingsPage() {
  return (
    <section className='space-y-8'>
      <h2 className='flex items-center gap-2 text-2xl font-semibold tracking-wider'>
        <CgProfile className='text-primary text-3xl' />
        <span>My settings</span>
      </h2>

      <Tabs defaultValue='profile' className='items-center gap-y-4'>
        <TabsList className='w-full max-w-xl'>
          <TabsTrigger value='profile'>
            <IoPerson />
          </TabsTrigger>
          <TabsTrigger value='security'>
            <IoShield />
          </TabsTrigger>
          <TabsTrigger value='sessions'>
            <IoKey />
          </TabsTrigger>
          <TabsTrigger value='accounts'>
            <FaLink />
          </TabsTrigger>
          <TabsTrigger value='danger'>
            <IoTrashBin />
          </TabsTrigger>
        </TabsList>

        <TabsContent value='profile' className='mx-auto w-full max-w-xl'>
          <Suspense fallback={<MiniLoader />}>
            <ProfileWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  );
}

async function ProfileWrapper() {
  const session = await getSessionAndAccounts(await headers());

  return <ProfileCard {...session} />;
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
