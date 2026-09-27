'use client';

import { SendEmailButton } from '@/shared/components/client';
import { toast } from 'sonner';
import { deleteAccountAction } from './delete-account-action';

export function SendDeleteAccountButton() {
  return (
    <SendEmailButton
      alreadySent={false}
      action={async () => {
        await deleteAccountAction();
      }}
      confirm={{
        actionLabel: 'Send Link',
        message: 'Send deletion confirmation email',
        description:
          'We will send an email with a link to confirm account deletion.',
      }}
      onSuccess={() => {
        toast.success('Email sent', {
          description:
            'Check your inbox for a link to confirm account deletion. The link will expire shortly.',
        });
      }}
      onError={error => {
        toast.error('Failed to send email', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }}
      variant='destructive'
      className='mx-auto w-full sm:w-fit'
    >
      Request Account Deletion
    </SendEmailButton>
  );
}
