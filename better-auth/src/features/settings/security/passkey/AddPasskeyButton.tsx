import { AuthenticatePriorAction } from '@/shared/action';
import { Button } from '@/shared/components/ui';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AddPasskeyForm } from './AddPasskeyForm';

export function AddPasskeyButton({
  is2FAEnabled: should2FA,
}: {
  is2FAEnabled: boolean;
}) {
  return (
    <AuthenticatePriorAction
      title={'Add Passkey'}
      description={'Add a new passkey for authentication'}
      trigger={
        <Button variant={'outline'} size={'sm'}>
          <IoMdAddCircleOutline /> Add a Passkey
        </Button>
      }
      should2FA={should2FA}
    >
      <AddPasskeyForm />
    </AuthenticatePriorAction>
  );
}
