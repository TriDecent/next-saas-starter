'use client';

import { MiniLoader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils';
import type { Organization } from 'better-auth/plugins';
import type React from 'react';
import { useTransition } from 'react';
import { PiCheckCircleFill } from 'react-icons/pi';
import { toast } from 'sonner';
import { SetActiveOrgAction } from './set-active-org-action';

export function ToggleActiveOrg({
  orgId,
  isActive,
  ...props
}: {
  orgId?: Organization['id'];
  isActive: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const [isPending, startTransition] = useTransition();

  const handleToggleActiveOrg = () =>
    startTransition(async () => {
      toast.loading('Setting active organization...', {
        id: 'set-active-org-action',
      });

      const response = await SetActiveOrgAction(
        { organizationId: orgId },
        ROUTES.organizations.href
      );

      if (response.type === 'success')
        toast.success('Organization set as active', {
          id: 'set-active-org-action',
        });

      if (response.type === 'error') {
        toast.error('Failed to set active organization', {
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
          <PiCheckCircleFill />
          {isActive ? 'Current Active' : 'Set Active'}
        </>
      )}
    </button>
  );
}
