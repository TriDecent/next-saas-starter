'use client';
import { ActionButton } from '@/features/shared/components';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { sendEmailVerificationAction } from './send-email-verification-action';

const RESEND_INTERVAL = 30;

export function SendVerificationEmail({ email }: { email: string }) {
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [countDown, setCountDown] = useState<number>(0);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    if (countDown === 0) return;
    timeoutRef.current = setInterval(() => {
      setCountDown(current => {
        if (current <= 1) {
          clearInterval(timeoutRef.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timeoutRef.current);
  }, [countDown]);

  return (
    <ActionButton
      action={async () => {
        await sendEmailVerificationAction(email);
      }}
      onSuccess={() => {
        toast.success('Verification email resent! Please check your inbox.');
        setHasSent(true);
        setCountDown(RESEND_INTERVAL);
      }}
      onError={error => {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error('Failed to resend email. Please try again later.');
      }}
      size='lg'
      disabled={countDown > 0}
      className='w-full bg-linear-to-r from-blue-500 to-indigo-600 px-8 hover:from-blue-600 hover:to-indigo-700 sm:w-auto'
    >
      {!hasSent
        ? 'Resend Verification Email'
        : countDown > 0
          ? `Resend in ${countDown}s`
          : 'Resend Again'}
    </ActionButton>
  );
}
