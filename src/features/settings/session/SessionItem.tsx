'use client';

import {
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { clientInfoRetriever } from '@/shared/utils';
import type { Session } from 'better-auth';
import { format } from 'date-fns';
import { MdLocationOn } from 'react-icons/md';
import { RevokeSessionButton } from './RevokeSessionButton';

export function SessionItem({
  userAgent,
  ipAddress,
  updatedAt,
  createdAt,
  isActive,
  token,
  onRevoke,
}: {
  userAgent: Session['userAgent'];
  ipAddress: Session['ipAddress'];
  updatedAt: Session['updatedAt'];
  createdAt: Session['createdAt'];
  isActive: boolean;
  token: Session['token'];
  onRevoke?: () => void;
}) {
  return (
    <Item variant='muted' className='border-border border'>
      <ItemMedia variant='icon'>
        {clientInfoRetriever.getDeviceIcon(userAgent)}
      </ItemMedia>
      <ItemContent className='min-w-0'>
        <ItemTitle>
          <span>
            {clientInfoRetriever.getBrowserInfo(userAgent)} on{' '}
            {clientInfoRetriever.getOSInfo(userAgent)}{' '}
          </span>
          {isActive ? <Badge>Current</Badge> : null}
        </ItemTitle>
        <ItemDescription className='line-clamp-none flex flex-col gap-y-2'>
          <span className='flex gap-1.5'>
            <MdLocationOn className='shrink-0' />
            <span className='truncate'>{ipAddress ?? 'Unknown location'}</span>
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
          <Button variant='outline' disabled size='xs'>
            Active
          </Button>
        ) : (
          <RevokeSessionButton token={token} onRevoke={onRevoke} />
        )}
      </ItemActions>
    </Item>
  );
}

function formatDate(date: Date) {
  return format(date, 'PPPP p');
}
