import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';
import { clientInfoRetriever } from '@/shared/utils';
import type { Session } from 'better-auth';
import { format } from 'date-fns';
import { MdLocationOn } from 'react-icons/md';
import { RevokeSessionButton } from './RevokeSessionButton';

export function SessionsCard({
  currentSession,
  otherSessions,
}: {
  currentSession: Session;
  otherSessions: Session[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent>
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

          {otherSessions.length > 0 ? (
            otherSessions.map(session => (
              <SessionItem
                key={session.id}
                userAgent={session.userAgent}
                ipAddress={session.ipAddress}
                updatedAt={session.updatedAt}
                createdAt={session.createdAt}
                isActive={false}
                token={session.token}
              />
            ))
          ) : (
            <Item variant='default'>
              <ItemContent className='text-center'>
                <ItemDescription>
                  No other active sessions found
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function SessionItem({
  userAgent,
  ipAddress,
  updatedAt,
  createdAt,
  isActive,
  token,
}: {
  userAgent: Session['userAgent'];
  ipAddress: Session['ipAddress'];
  updatedAt: Session['updatedAt'];
  createdAt: Session['createdAt'];
  isActive: boolean;
  token: Session['token'];
}) {
  return (
    <Item variant='muted'>
      <ItemMedia variant='icon'>
        {clientInfoRetriever.getDeviceIcon(userAgent)}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <span>
            {clientInfoRetriever.getBrowserInfo(userAgent)} on{' '}
            {clientInfoRetriever.getOSInfo(userAgent)}{' '}
          </span>
          {isActive ? <Badge>Current</Badge> : null}
        </ItemTitle>
        <ItemDescription className='line-clamp-none flex flex-col gap-y-2'>
          <span className='flex items-center gap-1.5'>
            <MdLocationOn />
            {ipAddress || 'Unknown location'}
          </span>
          <span className='text-xs'>
            <strong>Last updated:</strong> {formatDate(updatedAt)}
          </span>
          <span className='text-xs'>
            <strong>First seen:</strong> {formatDate(createdAt)}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {isActive ? (
          <Button variant='outline' size='sm' disabled>
            Active
          </Button>
        ) : (
          <RevokeSessionButton token={token} />
        )}
      </ItemActions>
    </Item>
  );
}

function formatDate(date: Date) {
  return format(date, 'PPPP p');
}
