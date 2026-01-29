'use server';

import { getAuthService } from '@/infrastructure/service';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/shared/components/ui';
import { COOKIES } from '@/shared/constants';
import { AlertTriangle, UserSearch } from 'lucide-react';
import { cookies } from 'next/headers';
import { EndImpersonation } from './EndImpersonation';
import { ImpersonationDurationTracker } from './ImpersonationDurationTracker';
import { OrchestratingRender } from './OrchestratingRender';

export async function ImpersonationStatus() {
  const [cookiesList, service] = await Promise.all([
    cookies(),
    getAuthService(),
  ]);
  const isImpersonating = cookiesList.has(COOKIES['admin-session'].name);

  if (
    !isImpersonating ||
    !service.currentSession ||
    !service.currentSession.impersonatedBy
  )
    return null;

  return (
    <>
      <div className='pointer-events-none fixed inset-0 z-9998 border-4 border-amber-500/30 shadow-[inset_0_0_36px] shadow-amber-500/30' />

      <OrchestratingRender
        first={
          <ImpersonationDurationTracker
            expiresAt={service.currentSession.expiresAt.getTime()}
          />
        }
        second={<ImpersonationDisplay />}
      />
    </>
  );
}

function ImpersonationDisplay() {
  return (
    <Item
      size={'sm'}
      className='phone-md:rounded-full pointer-events-auto mx-auto w-fit border-amber-500/50 shadow-2xl backdrop-blur-sm'
    >
      <ItemMedia
        variant={'icon'}
        className='flex items-center justify-center rounded-full bg-amber-500/20 text-amber-600'
      >
        <UserSearch />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='font-bold tracking-wider text-amber-600/70 uppercase'>
          Impersonating Mode
        </ItemTitle>
        <ItemDescription className='leading-none font-medium'>
          You are viewing as a user
        </ItemDescription>
      </ItemContent>

      <ItemSeparator orientation='vertical' />

      <ItemActions className='flex items-center gap-2'>
        <AlertTriangle className='text-amber-600' size={16} />
        <EndImpersonation />
      </ItemActions>
    </Item>
  );
}
