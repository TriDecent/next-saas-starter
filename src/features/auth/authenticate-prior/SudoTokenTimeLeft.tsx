'use client';

import { ToolTipPopover } from '@/shared/components/client';
import { Badge } from '@/shared/components/ui';
import { useRemainingTime } from '@/shared/hooks/client';
import { cn } from 'cn';
import { Timer } from 'lucide-react';
import type React from 'react';
import { useAuthenticatePrior } from './context/use-authenticate-prior';

export function SudoTokenTimeLeft({ className }: { className?: string }) {
  const expiresAtMs = useAuthenticatePrior(state => state.sudoTokenExpiresAt);

  return expiresAtMs ? (
    <SudoTokenCountdown expiresAtMs={expiresAtMs} className={className} />
  ) : null;
}

function SudoTokenCountdown({
  expiresAtMs,
  className,
}: {
  expiresAtMs: number;
  className?: string;
}) {
  const { formattedTime } = useRemainingTime({ expiresAtMs });

  return (
    <ToolTipPopover
      trigger={
        <TimerDisplay formattedTime={formattedTime} className={className} />
      }
      nativeButton={false}
    >
      Sudo session expires in
    </ToolTipPopover>
  );
}

function TimerDisplay({
  formattedTime,
  className,
  ...props
}: {
  formattedTime: string;
  className?: string;
} & React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={cn('pointer-events-auto shadow backdrop-blur-sm', className)}
      variant={'outline'}
      {...props}
    >
      <Timer className='text-muted-foreground' />
      <time
        dateTime={formattedTime}
        className='animate-pulse font-mono text-sm font-semibold tracking-wider'
      >
        {formattedTime}
      </time>
    </Badge>
  );
}
