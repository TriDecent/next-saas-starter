'use client';

import { useRemainingTime } from '@/shared/hooks/client';
import { Clock3 } from 'lucide-react';

export function ImpersonationDurationTracker({
  expiresAt,
}: {
  expiresAt: number;
}) {
  const { formattedTime } = useRemainingTime({ expiresAtMs: expiresAt });

  return (
    <div className='mx-auto flex w-fit items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/30 px-2 py-1 text-xs font-medium shadow-xs shadow-black backdrop-blur-sm'>
      <Clock3 className='size-3.5' />
      {formattedTime}
    </div>
  );
}
