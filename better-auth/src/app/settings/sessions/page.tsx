import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';

import { SessionsList } from '@/features/settings/session';
import { getUserService } from '@/infrastructure/service';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.sessions.href))
    .self;

  return {
    ...ROUTES.settings.nested.sessions.metadata,
    title: `${user.name}'s Sessions`,
  };
}

export default async function SessionsPage() {
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
