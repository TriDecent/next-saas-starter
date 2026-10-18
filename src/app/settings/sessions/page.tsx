import { SessionsList } from '@/features/settings/client';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.sessions.href))
    .actor;

  return {
    ...ROUTES.settings.nested.sessions.metadata,
    title: `${user.name}'s Sessions`,
  };
}

export default async function SessionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className='h-16 w-full' />}>
          <SessionsContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function SessionsContent() {
  const service = await getUserService(ROUTES.settings.nested.sessions.href);
  const sessions = await service.listMySessions();

  return (
    <SessionsList
      currentSession={service.currentSession}
      otherSessions={sessions.filter(
        session => session.id !== service.currentSession.id
      )}
    />
  );
}
