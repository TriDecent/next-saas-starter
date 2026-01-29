'use client';

import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ImpersonationDurationTracker({
  expiresAt,
}: {
  expiresAt: number;
}) {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const tick = () => {
      const next = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setRemaining(next);
      return next;
    };

    const timeoutId = setTimeout(() => tick(), 0);

    const intervalId = setInterval(() => {
      const next = tick();
      if (next <= 0) clearInterval(intervalId);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [expiresAt]);

  return (
    <div className='mx-auto flex w-fit items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/30 px-2 py-1 text-xs font-medium backdrop-blur-sm shadow-xs shadow-black'>
      <Clock3 className='size-3.5' />
      {formatDuration(remaining)}
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const remainingSecs = seconds % 60;

  return hours > 0
    ? `${hours}:${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`
    : `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
}
