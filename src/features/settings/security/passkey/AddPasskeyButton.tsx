'use client';

import { AuthenticatePriorAction } from '@/features/auth/authenticate-prior/client';
import { Button } from '@/shared/components/ui';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AddPasskeyForm } from './AddPasskeyForm';

export function AddPasskeyButton() {
  return (
    <AuthenticatePriorAction
      title={'Add Passkey'}
      description={'Add a new passkey for authentication'}
      trigger={
        <Button variant={'outline'}>
          <IoMdAddCircleOutline /> Add a Passkey
        </Button>
      }
    >
      <AddPasskeyForm />
    </AuthenticatePriorAction>
  );
}
