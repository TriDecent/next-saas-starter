'use client';

import { AuthenticatePriorAction } from '@/features/auth/authenticate-prior';
import {
  Button,
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollArea,
  ScrollBar,
} from '@/shared/components/ui';
import { KeyRound } from 'lucide-react';
import { ChangePasswordForm } from './ChangePasswordForm';

export function ChangePasswordCard() {
  return (
    <Card>
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
              <Button className='w-full sm:w-auto'>
                <KeyRound className='h-4 w-4' />
                Change Password
              </Button>
            }
          >
            {enteredPassword => (
              <ScrollArea className='h-96 pb-12'>
                <ScrollBar />
                <div
                  className={`mx-auto flex max-w-xl flex-col gap-y-8 px-4 pt-2 pb-12`}
                >
                  <ChangePasswordForm currentPassword={enteredPassword} />
                </div>
              </ScrollArea>
            )}
          </AuthenticatePriorAction>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
