'use client';

import { SendEmailButton } from '@/shared/components/client';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { sendEmailVerificationAction } from './send-email-verification-action';

export function SendVerificationEmailButton({
  email,
  alreadySent,
  callbackURL,
  ...props
}: {
  email: string;
  alreadySent: boolean;
  callbackURL: string;
} & Omit<ComponentProps<typeof SendEmailButton>, 'action'>) {
  return (
    <SendEmailButton
      {...props}
      alreadySent={alreadySent}
      action={async () => {
        await sendEmailVerificationAction(email, callbackURL);
      }}
      onSuccess={() => {
        toast.success('Verification email resent! Please check your inbox.');
      }}
      onError={error => {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error('Failed to resend email. Please try again later.');
      }}
    />
  );
}
