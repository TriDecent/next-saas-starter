import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import type { ReactNode } from 'react';

export function ToolTipPopover({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='text-xs'>
        <p>{message}</p>
      </PopoverContent>
    </Popover>
  );
}
