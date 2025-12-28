import { AuthCard } from '../_shared';
import { SignUpForm } from './SignUpForm';

export function SignUpCard() {
  return (
    <AuthCard
      title='Sign Up'
      description='Create a new account by filling in the details below.'
    >
      <SignUpForm />
    </AuthCard>
  );
}
