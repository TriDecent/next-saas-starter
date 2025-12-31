'use client';

import { Button } from '@/shared/components/ui';
import { useEffect, useTransition } from 'react';
import { LuLockKeyhole } from 'react-icons/lu';
import { toast } from 'sonner';
import { enableTwoFactorsAction } from './enable-two-factors-action';

export function EnableTwoFactorsButton({
  password,
  onSuccess,
}: {
  password: string;
  onSuccess: (
    data: Extract<
      Awaited<ReturnType<typeof enableTwoFactorsAction>>,
      { type: 'success' }
    >['payload']
  ) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleEnable2FA = () =>
    startTransition(async () => {
      const response = await enableTwoFactorsAction(password);

      if (response.type === 'success') {
        toast.success(TOAST_MESSAGES.success.title, {
          id: 'enable-2-fa',
          description: TOAST_MESSAGES.success.description,
        });
        onSuccess(response.payload);
        return;
      }

      if (response.type !== 'error') return;

      toast.error(TOAST_MESSAGES.error.title, {
        id: 'enable-2-fa',
        description:
          response.payload.message || TOAST_MESSAGES.error.description,
      });
    });

  useEffect(() => {
    if (!isPending) return;

    toast.loading(TOAST_MESSAGES.loading.title, {
      id: 'enable-2-fa',
      description: TOAST_MESSAGES.loading.description,
    });
  }, [isPending]);

  return (
    <Button
      disabled={isPending}
      className='mx-auto w-full md:w-fit'
      onClick={handleEnable2FA}
    >
      <LuLockKeyhole /> Enable 2FA
    </Button>
  );
}

const TOAST_MESSAGES = {
  loading: {
    title: 'Preparing TOTP…',
    description:
      'Verifying your password and generating a QR code. The secret will only be shown once — save it securely.',
  },
  success: {
    title: 'TOTP is ready',
    description:
      'TOTP is active. Scan the QR with your authenticator app and securely store your backup codes.',
  },
  error: {
    title: 'Failed to enable authenticator',
    description:
      'Verification failed or an internal error occurred. Check your password and try again.',
  },
} as const;
