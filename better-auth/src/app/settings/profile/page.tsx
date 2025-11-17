import { ProfileCard } from '@/features/settings/profile';
import { prisma } from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect(ROUTES.auth.href);

  return {
    ...ROUTES.settings.metadata,
    title: `${session.user.name}'s Profile`,
  };
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(ROUTES.auth.href);

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
  });

  return <ProfileCard user={session.user} accounts={accounts} />;
}
