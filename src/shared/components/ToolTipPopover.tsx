'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui';
import { useBreakpoint } from '@/shared/hooks/client';

export function ToolTipPopover({
  trigger,
  nativeButton,
  children,
}: {
  trigger: React.ReactElement;
  nativeButton: boolean;
  children: React.ReactNode;
}) {
  const isMobile = useBreakpoint() === 'sm';

  if (isMobile)
    return (
      <Popover>
        <PopoverTrigger render={trigger} nativeButton={nativeButton} />
        <PopoverContent className='w-fit max-w-72 text-xs'>
          {children}
        </PopoverContent>
      </Popover>
    );

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}
