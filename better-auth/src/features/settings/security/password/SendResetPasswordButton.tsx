'use client';

import { authClient } from '@/lib/auth-client';
import { SendEmailButton } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { toast } from 'sonner';

export function SendResetPasswordButton({ email }: { email: string }) {
  return (
    <SendEmailButton
      alreadySent={false}
      action={async () => {
        await authClient.requestPasswordReset(
          {
            email,
            redirectTo: ROUTES.auth.nested['reset-password'].href,
          },
          {
            onError: error => {
              toast.error('Failed to send reset password email', {
                description: error.error.message,
              });
            },
          }
        );
      }}
      onSuccess={() =>
        toast.success('Reset password email sent', {
          description: 'Check your inbox for a link to reset your password.',
        })
      }
      className='min-w-30'
    />
  );
}
