import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { AuthCard } from '../_shared';
import { ResetPasswordForm } from './ResetPasswordForm';

export function ResetPasswordCard() {
  return (
    <AuthCard
      title='Reset Password'
      description='Enter your email address and we will send you a link to reset your password.'
      className='space-y-8'
    >
      <ResetPasswordForm />

      <div className='text-muted-foreground flex flex-col items-center gap-2 text-sm md:flex-row md:justify-end'>
        <p>Remember your password?</p>
        <Button
          variant={'link'}
          className='underline'
          nativeButton={false}
          render={<Link href={ROUTES.auth.href}>Back to Sign In</Link>}
        ></Button>
      </div>
    </AuthCard>
  );
}
