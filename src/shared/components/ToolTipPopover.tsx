import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import type { ComponentProps, ReactElement } from 'react';

export function ToolTipPopover({
  children,
  message,
  ...props
}: {
  children: ReactElement;
  message: string;
} & ComponentProps<typeof PopoverTrigger>) {
  return (
    <Popover>
      <PopoverTrigger {...props} render={children} />
      <PopoverContent className='text-xs'>
        <p>{message}</p>
      </PopoverContent>
    </Popover>
  );
}
