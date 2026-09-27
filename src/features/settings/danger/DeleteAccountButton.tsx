'use client';

import { ActionButton } from '@/shared/components/client';
import { toast } from 'sonner';
import { deleteAccountAction } from './delete-account-action';

export function DeleteAccountButton({ token }: { token?: string }) {
  const isConfirm = !!token;

  return (
    <ActionButton
      action={async () => {
        await deleteAccountAction(token);
      }}
      confirm={{
        actionLabel: isConfirm ? 'Delete' : 'Send Link',
        message: isConfirm
          ? 'Confirm permanent account deletion'
          : 'Send deletion confirmation email',
        description: isConfirm
          ? 'This will permanently delete your account and all data. This cannot be undone.'
          : 'We will send an email with a link to confirm account deletion.',
      }}
      onSuccess={() => {
        if (isConfirm) {
          toast.success('Account deleted', {
            description:
              'Your account and all associated data have been permanently removed.',
          });

          return;
        }

        toast.success('Email sent', {
          description:
            'Check your inbox for a link to confirm account deletion. The link will expire shortly.',
        });
      }}
      onError={error => {
        toast.error(isConfirm ? 'Deletion failed' : 'Failed to send email', {
          description:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }}
      variant='destructive'
      className='mx-auto w-full sm:w-fit'
    >
      {isConfirm ? 'Confirm Delete Account' : 'Request Account Deletion'}
    </ActionButton>
  );
}
