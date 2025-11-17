'use client';

import { Button } from '@/shared/components/ui';
import { useEffect, useTransition, type ComponentProps } from 'react';
import { MiniLoader } from './MiniLoading';

type ActionButtonProps = {
  action: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error | unknown) => void;
  onPending?: () => void;
};

export function ActionButton({
  action,
  onSuccess,
  onError,
  onPending,
  ...props
}: ActionButtonProps & ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isPending) return;
    onPending?.();
  }, [isPending, onPending]);

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
            if (
              error &&
              typeof error === 'object' &&
              'digest' in error &&
              typeof error.digest === 'string' &&
              error.digest.startsWith('NEXT_REDIRECT')
            )
              throw error;

            startTransition(() => onError?.(error));
          }
        })
      }
    >
      {isPending ? <MiniLoader /> : props.children}
    </Button>
  );
}
