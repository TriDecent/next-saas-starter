'use client';
import { EmailVerificationCard } from '@/features/email';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAppSelector } from '@/shared/hooks';
import { FaPlus, FaSignInAlt } from 'react-icons/fa';
import { SignInCard } from './sign-in';
import { SignupCard } from './SignupCard';

export function AuthCardSelection() {
  const verificationInfo = useAppSelector(state => state.ui.verificationInfo);

  return !verificationInfo ? (
    <Tabs defaultValue='signin' className='mx-auto max-w-xl'>
      <TabsList>
        <TabsTrigger value='signin'>
          <FaSignInAlt />
          Sign In
        </TabsTrigger>
        <TabsTrigger value='signup'>
          <FaPlus />
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent value='signin'>
        <SignInCard />
      </TabsContent>

      <TabsContent value='signup'>
        <SignupCard />
      </TabsContent>
    </Tabs>
  ) : (
    <EmailVerificationCard
      callbackURL={ROUTES.home.href}
      isEmailSent={true}
      {...verificationInfo}
    />
  );
}
