import { CheckboxField } from '@/shared/components/form/client';

export function TrustDeviceField({ isPending }: { isPending: boolean }) {
  return (
    <CheckboxField
      id='trust-device'
      name='trustDevice'
      labelText='Trust this device'
      description='Remember this device and skip 2FA for 30 days.'
      disabled={isPending}
      variant='card'
    />
  );
}
