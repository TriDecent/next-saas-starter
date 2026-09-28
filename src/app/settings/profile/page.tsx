import { ProfileCard } from '@/features/settings';
import { getUserService } from '@/services';
import { Loading } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.profile.href))
    .actor;

  return {
    ...ROUTES.settings.nested.profile.metadata,
    title: `${user.name}'s Profile`,
  };
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const service = await getUserService(ROUTES.settings.nested.profile.href);

  return <ProfileCard user={service.actor} />;
}
