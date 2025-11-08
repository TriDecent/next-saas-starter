'use client';

import { Button } from '@/features/shared/components/ui';
import { LoaderPinwheel } from 'lucide-react';
import { useTransition, type ComponentProps } from 'react';

export function ActionButton({
  action,
  ...props
}: { action: () => Promise<void> } & ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      {...props}
      disabled={isPending}
      onClick={() => startTransition(() => action())}
    >
      {isPending ? <LoaderPinwheel className='animate-spin' /> : props.children}
    </Button>
  );
}
