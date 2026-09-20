'use client';

import { toast } from 'sonner';
import { cn } from '../utils';

type CopyTextProps = React.HTMLAttributes<HTMLButtonElement> & {
  text: string;
  children: React.ReactNode;
  onSuccess: string | (() => void);
};

export function CopyText({
  text,
  children,
  onSuccess,
  ...props
}: CopyTextProps) {
  return (
    <button
      {...props}
      onClick={async e => {
        await navigator.clipboard.writeText(text);

        if (typeof onSuccess === 'function') {
          onSuccess();
          return;
        }

        toast.success(onSuccess);
        props.onClick?.(e);
      }}
      className={cn('w-full', props.className)}
    >
      {children}
    </button>
  );
}
