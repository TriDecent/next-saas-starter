'use client';

import { Button } from '@/shared/components/ui';
import { useEffect, useTransition } from 'react';
import { LuLockKeyholeOpen } from 'react-icons/lu';
import { toast } from 'sonner';
import { disableTwoFactorsAction } from './disable-two-factors-action';

export function DisableTwoFactorsButton({
  password,
  onSuccess,
}: {
  password: string;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDisable2FA = () =>
    startTransition(async () => {
      const response = await disableTwoFactorsAction(password);

      if (response.type === 'success') {
        toast.success(TOAST_MESSAGES.success.title, {
          id: 'disable-2-fa',
          description: TOAST_MESSAGES.success.description,
        });
        onSuccess();

        return;
      }

      if (response.type !== 'error') return;

      toast.error(TOAST_MESSAGES.error.title, {
        id: 'disable-2-fa',
        description:
          response.payload.message || TOAST_MESSAGES.error.description,
      });
    });

  useEffect(() => {
    if (!isPending) return;

    toast.loading(TOAST_MESSAGES.loading.title, {
      id: 'disable-2-fa',
      description: TOAST_MESSAGES.loading.description,
    });
  }, [isPending]);

  return (
    <Button
      disabled={isPending}
      className='mx-auto w-full md:w-fit'
      onClick={handleDisable2FA}
      variant='destructive'
    >
      <LuLockKeyholeOpen /> Disable 2FA
    </Button>
  );
}

const TOAST_MESSAGES = {
  loading: {
    title: 'Disabling TOTP…',
    description: 'Verifying your password and authenticator code. Please wait.',
  },
  success: {
    title: '2FA disabled',
    description:
      'Two-factor authentication has been disabled for your account.',
  },
  error: {
    title: 'Failed to disable 2FA',
    description:
      'Verification failed or an internal error occurred. Check your credentials and try again.',
  },
} as const;
