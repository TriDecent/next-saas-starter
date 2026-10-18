'use client';

import { MiniLoader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils';
import type { Organization } from 'better-auth/plugins';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useTransition } from 'react';
import { PiCheckCircleFill, PiXCircleFill } from 'react-icons/pi';
import { toast } from 'sonner';
import { toggleOrgStatus } from './toggle-org-status-action';

export function ToggleOrgStatus({
  orgId,
  isActive,
  ...props
}: {
  orgId?: Organization['id'] | null;
  isActive: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleActiveOrg = () =>
    startTransition(async () => {
      toast.loading('Updating active organization...', {
        id: 'set-active-org-action',
      });

      const response = await toggleOrgStatus(
        { organizationId: orgId },
        ROUTES.organizations.href
      );

      if (response.type === 'success') {
        toast.success('Active organization status updated', {
          id: 'set-active-org-action',
        });
        router.refresh();
        return;
      }

      if (response.type === 'error') {
        toast.error('Failed to update active organization status', {
          id: 'set-active-org-action',
        });
      }
    });

  return (
    <button
      {...props}
      onClick={e => {
        handleToggleActiveOrg();
        props.onClick?.(e);
      }}
      disabled={isPending}
      className={cn('w-full', props.className)}
    >
      {isPending ? (
        <MiniLoader />
      ) : (
        <>
          {isActive ? <PiXCircleFill /> : <PiCheckCircleFill />}
          {isActive ? 'Deactivate' : 'Activate'}
        </>
      )}
    </button>
  );
}
