import { FormField } from '@/shared/components';
import { VscWorkspaceTrusted } from 'react-icons/vsc';

export function TrustDeviceField({ isPending }: { isPending: boolean }) {
  return (
    <FormField
      kind='checkbox'
      id='trust-device'
      name='trustDevice'
      labelText='Trust this device'
      description='Remember this device and skip 2FA for 30 days.'
      addons={<VscWorkspaceTrusted />}
      disabled={isPending}
    />
  );
}
