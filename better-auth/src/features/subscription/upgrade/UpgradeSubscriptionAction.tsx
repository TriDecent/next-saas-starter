'use client';

import { type Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  upgradeSubscriptionAction,
  type UpgradeSubscriptionActionInput,
} from './upgrade-subscription-action';

export function UpgradeSubscriptionAction({
  options,
  ...props
}: { options: UpgradeSubscriptionActionInput } & React.ComponentPropsWithoutRef<
  typeof Button
>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpgradeSubscription = () =>
    startTransition(async () => {
      toast.loading('', {
        id: 'upgrade-subscription-action',
        description: 'Upgrading subscription...',
      });

      const response = await upgradeSubscriptionAction(
        options,
        ROUTES.settings.nested.subscription.href
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
    <button {...props} onClick={handleUpgradeSubscription} disabled={isPending}>
      {props.children}
    </button>
  );
}
