'use client';

import { AuthenticatePriorAction } from '@/features/auth/authenticate-prior';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@/shared/components/ui';
import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { deletePasskeyAction } from './delete-passkey-action';

export function DeletePassKeyButton({ passkeyId }: { passkeyId: string }) {
  return (
    <AuthenticatePriorAction
      trigger={
        <Button
          variant={'ghost'}
          size='icon'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 className='size-4' />
        </Button>
      }
      title={'Delete Passkey'}
      description={
        'This action cannot be undone. This will permanently delete the passkey'
      }
    >
      <DeletePasskeyOnAuthenticated passkeyId={passkeyId} />
    </AuthenticatePriorAction>
  );
}

function DeletePasskeyOnAuthenticated({ passkeyId }: { passkeyId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const handleDeletePasskey = useCallback(async () => {
    const result = await deletePasskeyAction(passkeyId);
    if (result.type === 'initial') return;
    if (result.type === 'success') {
      toast.success('Passkey deleted successfully');
      return;
    }

    toast.error('Error deleting passkey', {
      description: result.payload.message,
    });
  }, [passkeyId]);

  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            passkey
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setIsDialogOpen(false);
              await handleDeletePasskey();
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
