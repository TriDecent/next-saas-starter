'use client';

import { Button } from '@/features/shared/components/ui';
import { useTransition, type ComponentProps } from 'react';
import { MiniLoader } from './MiniLoading';

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
      {isPending ? <MiniLoader /> : props.children}
    </Button>
  );
}
