'use client';

import { AuthenticatePriorAction } from '@/features/auth/authenticate-prior';
import { Button } from '@/shared/components/ui';
import { Trash2 } from 'lucide-react';
import { useCallback, useTransition } from 'react';
import { toast } from 'sonner';
import { deletePasskeyAction } from './delete-passkey-action';

export function DeletePassKeyButton({ passkeyId }: { passkeyId: string }) {
  const [isPending, startTransition] = useTransition();
  const handleDeletePasskey = useCallback(() => {
    startTransition(async () => {
      const result = await deletePasskeyAction(passkeyId);
      if (result.type === 'success') {
        toast.success('Passkey deleted successfully');
        return;
      }

      toast.error('Error deleting passkey', {
        description: result.payload.message,
      });
    });
  }, [passkeyId]);

  return (
    <AuthenticatePriorAction
      trigger={
        <Button size='icon-lg' variant={'destructive'}>
          <Trash2 className='size-4' />
        </Button>
      }
      title={'Delete Passkey'}
      description={
        'This action cannot be undone. This will permanently delete the passkey'
      }
    >
      <div className='mx-auto w-fit pb-8'>
        <Button disabled={isPending} onClick={handleDeletePasskey}>
          Yes
        </Button>
      </div>
    </AuthenticatePriorAction>
  );
}
