import { InputField } from '@/shared/components/form/client';

export function PasswordField({ isPending }: { isPending: boolean }) {
  return (
    <InputField
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
