import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { AuthCard } from '../_shared';

import { UpdatePasswordForm } from './UpdatePasswordForm';

export function UpdatePasswordCard({ token }: { token: string }) {
  return (
    <AuthCard
      title='Update Password'
      description='Enter your new password to complete the reset process.'
      className='space-y-8'
    >
      <UpdatePasswordForm token={token} />

      <div className='text-muted-foreground flex flex-col items-center gap-2 text-sm md:flex-row md:justify-end'>
        <p>Remember your password?</p>
        <Button variant={'link'} asChild className='underline'>
          <Link href={ROUTES.auth.href}>Back to Sign In</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
