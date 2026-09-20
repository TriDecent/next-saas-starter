import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';

import { Clock, Mail, Shield } from 'lucide-react';
import { SendVerificationEmailButton } from './SendVerificationEmailButton';

interface EmailVerificationTemplateProps {
  name: string;
  email: string;
  callbackURL: string;
  isEmailSent: boolean;
}

export function EmailVerificationCard({
  name,
  email,
  callbackURL,
  isEmailSent,
}: EmailVerificationTemplateProps) {
  return (
    <Card className='mx-auto max-w-2xl shadow-xl'>
      <CardHeader className='space-y-4 pb-8 text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600'>
          <Mail className='h-8 w-8 text-white' />
        </div>

        <CardTitle className='text-3xl font-bold'>
          Verify Your Email Address
        </CardTitle>

        <CardDescription className='text-base'>
          {name ? `Hi ${name}, welcome aboard! ` : 'Welcome! '}
          We&apos;re excited to have you get started. First, you need to confirm
          your account.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='bg-muted space-y-4 rounded-lg p-6'>
          <Item size={'sm'}>
            <ItemMedia>
              <Shield className='text-blue-600' />
            </ItemMedia>

            <ItemContent>
              <ItemTitle>Why verify</ItemTitle>

              <ItemDescription className='line-clamp-none text-pretty'>
                Verification helps us ensure the security of your account and
                that we can reach you with important updates.
              </ItemDescription>
            </ItemContent>
          </Item>

          <Item size={'sm'}>
            <ItemMedia>
              <Clock className='mt-0.5 h-5 w-5 text-blue-600' />
            </ItemMedia>

            <ItemContent>
              <ItemTitle>Act quickly</ItemTitle>

              <ItemDescription className='line-clamp-none text-pretty'>
                This verification link will expire soon. After that, you&apos;ll
                need to request a new one.
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>

        <div className='text-center'>
          <SendVerificationEmailButton
            email={email}
            callbackURL={callbackURL}
            alreadySent={isEmailSent}
            className='w-full bg-linear-to-r from-blue-500 to-indigo-600 px-8 hover:from-blue-600 hover:to-indigo-700 sm:w-auto'
          />
        </div>
      </CardContent>

      <CardFooter className='text-muted-foreground flex-col gap-2 border-t pt-6 text-center text-sm'>
        <p>
          Please check your email inbox and follow the instructions to verify
          your account.
        </p>
        <p className='text-xs'>
          Didn&apos;t receive the email? Check your spam folder or try resending
          the verification email.
        </p>
      </CardFooter>
    </Card>
  );
}
