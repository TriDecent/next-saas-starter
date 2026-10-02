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
import { Suspense } from 'react';
import { MdEmail } from 'react-icons/md';
import { ChangeEmailForm } from './ChangeEmailForm';

export function ChangeEmailCard({
  callbackURL,
  className,
}: {
  callbackURL: string;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>
          Change the email address you use to sign in and receive notifications.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <CardAction className='w-full'>
          <Suspense>
            <AuthenticatePriorAction
              title='Change Email'
              description='Please verify your identity before changing your email address.'
              trigger={
                <Button className='w-full'>
                  <MdEmail /> Change email
                </Button>
              }
            >
              <ChangeEmailForm callbackURL={callbackURL} />
            </AuthenticatePriorAction>
          </Suspense>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
