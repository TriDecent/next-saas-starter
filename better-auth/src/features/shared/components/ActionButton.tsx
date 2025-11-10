'use client';

import { Button } from '@/features/shared/components/ui';
import { LoaderPinwheel } from 'lucide-react';
import { useTransition, type ComponentProps } from 'react';

type ActionButtonProps = {
  action: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error | unknown) => void;
};

export function ActionButton({
  action,
  onSuccess,
  onError,
  ...props
}: ActionButtonProps & ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      {...props}
      disabled={isPending ? isPending : props.disabled}
      onClick={() =>
        startTransition(async () => {
          try {
            await action();
            startTransition(() => onSuccess?.());
          } catch (error) {
            startTransition(() => onError?.(error));
          }
        })
      }
    >
      {isPending ? <LoaderPinwheel className='animate-spin' /> : props.children}
    </Button>
  );
}
