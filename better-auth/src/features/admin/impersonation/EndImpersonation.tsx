'use client';

import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { stopImpersonateAction } from './stop-impersonate-action';

export function EndImpersonation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleStopImpersonating = () =>
    startTransition(async () => {
      const response = await stopImpersonateAction(ROUTES.home.href);

      if (response.type === 'error') {
        toast.error('Failed to stop impersonation!', {
          description: response.payload.message,
        });

        return;
      }

      router.push(ROUTES.admin.href);
      router.refresh();
    });
  return (
    <Button onClick={handleStopImpersonating} disabled={isPending}>
      Stop
    </Button>
  );
}
