import { FormField } from '@/shared/components';
import { VscWorkspaceTrusted } from 'react-icons/vsc';

export function TrustDeviceField({ isPending }: { isPending: boolean }) {
  return (
    <FormField
      kind='checkbox'
      id='trust-device'
      name='trustDevice'
      labelText='Trust this device'
      description='You will not be prompted for two-factor authentication on this device for the next 30 days.'
      addons={<VscWorkspaceTrusted />}
      disabled={isPending}
    />
  );
}
