import { COOKIES } from '@/shared/constants';
import { AlertTriangle, UserSearch } from 'lucide-react';
import { cookies } from 'next/headers';
import { EndImpersonation } from './EndImpersonation';

export async function ImpersonationStatus() {
  const cookiesList = await cookies();
  const isImpersonating = cookiesList.has(COOKIES['admin-session'].name);

  if (!isImpersonating) return null;

  return (
    <>
      <div className='pointer-events-none fixed inset-0 z-9998 border-4 border-amber-500/30 shadow-[inset_0_0_36px] shadow-amber-500/30' />

      <div className='pointer-events-none fixed inset-x-0 bottom-6 z-9999 flex justify-center'>
        <div className='bg-background/80 pointer-events-auto flex items-center gap-4 rounded-full border border-amber-500/50 px-4 py-2 shadow-2xl backdrop-blur-md'>
          <div className='border-border flex items-center gap-2 border-r pr-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-600'>
              <UserSearch size={18} />
            </div>
            <div className='flex flex-col'>
              <p className='text-[10px] font-bold tracking-wider text-amber-600/70 uppercase'>
                Impersonating Mode
              </p>
              <p className='text-sm leading-none font-medium'>
                You are viewing as a user
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <AlertTriangle className='text-amber-500' size={16} />
            <EndImpersonation />
          </div>
        </div>
      </div>
    </>
  );
}
