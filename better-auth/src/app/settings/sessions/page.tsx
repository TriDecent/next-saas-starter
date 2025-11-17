import { SessionsCard } from '@/features/settings/session';
import { auth, ensureSession } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const session = await ensureSession(
    await headers(),
    ROUTES.settings.nested.sessions.href
  );

  return {
    ...ROUTES.settings.nested.sessions.metadata,
    title: `${session.user.name}'s Sessions`,
  };
}

export default async function SessionsPage() {
  const headersList = await headers();

  const [currentSession, sessions] = await Promise.all([
    ensureSession(headersList, ROUTES.settings.nested.sessions.href),
    auth.api.listSessions({ headers: headersList }),
  ]);

  if (!currentSession) redirect(ROUTES.auth.href);

  return (
    <SessionsCard
      currentSession={currentSession.session}
      otherSessions={sessions.filter(
        session => session.id !== currentSession.session.id
      )}
    />
  );
}
