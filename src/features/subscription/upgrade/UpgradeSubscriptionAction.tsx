'use client';

import { Button } from '@/shared/components/ui';
import { useRouteContext } from '@/shared/context';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useEntityReference } from '../context/client';
import {
  upgradeSubscriptionAction,
  type UpgradeSubscriptionActionInput,
} from './upgrade-subscription-action';

export function UpgradeSubscriptionAction({
  options,
  ...props
}: {
  options: UpgradeSubscriptionActionInput;
} & React.ComponentPropsWithoutRef<typeof Button>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { callbackUrl } = useRouteContext();
  const { referenceId } = useEntityReference();

  const handleUpgradeSubscription = () =>
    startTransition(async () => {
      toast.loading('', {
        id: 'upgrade-subscription-action',
        description: 'Upgrading subscription...',
      });

      const response = await upgradeSubscriptionAction(
        { ...options, referenceId: options.referenceId ?? referenceId },
        callbackUrl
      );

      if (response.type === 'error') {
        toast.error('Failed to upgrade subscription!', {
          id: 'upgrade-subscription-action',
          description: response.payload.message,
        });

        return;
      }

      toast.success('Subscription upgraded successfully!', {
        id: 'upgrade-subscription-action',
        description: 'Redirecting to checkout...',
      });
      if (!response.payload.redirect || !response.payload.url) return;

      router.push(response.payload.url);
    });

  return (
    <Button {...props} onClick={handleUpgradeSubscription} disabled={isPending}>
      {props.children}
    </Button>
  );
}
