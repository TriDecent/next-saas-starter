import { ProfileCard } from '@/features/settings/profile';
import { getUserService } from '@/infrastructure/service';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.profile.href)).self;

  return {
    ...ROUTES.settings.nested.profile.metadata,
    title: `${user.name}'s Profile`,
  };
}

export default async function ProfilePage() {
  const service = await getUserService(ROUTES.settings.nested.profile.href);

  return <ProfileCard user={service.self} />;
}
