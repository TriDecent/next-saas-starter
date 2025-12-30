import { FormField } from '@/shared/components';

export function PasswordField({ isPending }: { isPending: boolean }) {
  return (
    <FormField
      kind='input'
      id='password'
      name='password'
      labelText='Password'
      description='Enter your account password to confirm this action.'
      placeholder='********'
      type='password'
      disabled={isPending}
      autoComplete='current-password webauthn'
    />
  );
}
