'use client';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  Separator,
} from '@/shared/components/ui';
import type { Session } from 'better-auth';
import { useOptimistic } from 'react';
import { SessionItem } from './SessionItem';

export function SessionsList({
  currentSession,
  otherSessions,
}: {
  currentSession: Session;
  otherSessions: Session[];
}) {
  const [optimisticOtherSessions, dispatch] = useOptimistic<
    Session[],
    SessionAction
  >(otherSessions, sessionReducer);

  return (
    <ItemGroup className='flex flex-col gap-y-4'>
      <SessionItem
        userAgent={currentSession.userAgent}
        ipAddress={currentSession.ipAddress}
        updatedAt={currentSession.updatedAt}
        createdAt={currentSession.createdAt}
        isActive={true}
        token={currentSession.token}
      />

      <Separator />

      {optimisticOtherSessions.length > 0 ? (
        optimisticOtherSessions.map(session => (
          <SessionItem
            key={session.id}
            userAgent={session.userAgent}
            ipAddress={session.ipAddress}
            updatedAt={session.updatedAt}
            createdAt={session.createdAt}
            isActive={false}
            token={session.token}
            onRevoke={() =>
              dispatch({ type: 'remove', payload: { id: session.id } })
            }
          />
        ))
      ) : (
        <Item variant='default'>
          <ItemContent className='text-center'>
            <ItemDescription>No other active sessions found</ItemDescription>
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  );
}

type SessionAction = { type: 'remove'; payload: { id: Session['id'] } };

const sessionReducer = (state: Session[], action: SessionAction): Session[] => {
  switch (action.type) {
    case 'remove':
      return state.filter(session => session.id !== action.payload.id);

    default:
      return state;
  }
};
