'use client';

import { AuthenticatePriorAction } from '@/features/auth/authenticate-prior/client';
import {
  Button,
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { cn } from '@/shared/utils';
import { KeyRound } from 'lucide-react';
import { ChangePasswordForm } from './ChangePasswordForm';

export function ChangePasswordCard({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <CardAction className='w-full'>
          <AuthenticatePriorAction
            title='Change Password'
            description='Enter your new password below. You will be signed out from other devices if selected.'
            trigger={
              <Button className='w-full'>
                <KeyRound className='h-4 w-4' />
                Change Password
              </Button>
            }
          >
            {enteredPassword => (
              <ChangePasswordForm currentPassword={enteredPassword} />
            )}
          </AuthenticatePriorAction>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
