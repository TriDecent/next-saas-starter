import { ProfileCard } from '@/features/settings/profile';
import { ensureSession } from '@/lib';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const session = await ensureSession(
    await headers(),
    ROUTES.settings.nested.profile.href
  );

  return {
    ...ROUTES.settings.nested.profile.metadata,
    title: `${session.user.name}'s Profile`,
  };
}

export default async function ProfilePage() {
  const session = await ensureSession(
    await headers(),
    ROUTES.settings.nested.profile.href
  );

  return <ProfileCard user={session.user} />;
}
