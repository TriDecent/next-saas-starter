import { SessionsList } from '@/features/settings/client';
import { getUserService } from '@/infrastructure/composition/factory';
import { Loading } from '@/shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    <Suspense fallback={<Loading />}>
      <SessionsContent />
    </Suspense>
  );
}

async function SessionsContent() {
  const service = await getUserService(ROUTES.settings.nested.sessions.href);
  const sessions = await service.listMySessions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SessionsList
          currentSession={service.currentSession}
          otherSessions={sessions.filter(
            session => session.id !== service.currentSession.id
          )}
        />
      </CardContent>
    </Card>
  );
}
