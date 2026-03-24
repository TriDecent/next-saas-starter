'use client';

import { useRouteContext } from '@/shared/context';
import { useRouter } from 'next/navigation';
import { useTransition, type ComponentPropsWithoutRef } from 'react';
import { toast } from 'sonner';
import { createBillingPortalAction } from './create-billing-portal-action';

export function CreateBillingPortalAction({
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { callbackUrl } = useRouteContext();

  const handleCreateBillingPortal = () =>
    startTransition(async () => {
      toast.loading('Opening billing portal...', {
        id: 'billing-portal-action',
        description: 'You will be redirected shortly.',
      });

      const response = await createBillingPortalAction(callbackUrl);

      if (response.type === 'error') {
        toast.error('Failed to open billing portal!', {
          id: 'billing-portal-action',
          description: response.payload.message,
        });

        return;
      }

      toast.success('Billing portal opened successfully!', {
        id: 'billing-portal-action',
        description: 'Redirecting...',
      });
      if (!response.payload.redirect || !response.payload.url) return;

      router.push(response.payload.url);
    });

  return (
    <button {...props} onClick={handleCreateBillingPortal} disabled={isPending}>
      {props.children}
    </button>
  );
}
