import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import type { ReactElement } from 'react';

export function ToolTipPopover({
  children,
  message,
}: {
  children: ReactElement;
  message: string;
}) {
  return (
    <Popover>
      <PopoverTrigger render={children} />
      <PopoverContent className='text-xs'>
        <p>{message}</p>
      </PopoverContent>
    </Popover>
  );
}
