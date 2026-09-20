'use client';

import { EmailVerificationCard } from '@/features/email';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { FaPlus, FaSignInAlt } from 'react-icons/fa';
import { SignInCard } from './sign-in';
import { SignUpCard } from './sign-up';
import { useVerificationStore } from './store';

export function AuthCardSelection() {
  const info = useVerificationStore(state => state.verificationInfo);

  return !info ? (
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
        <SignUpCard />
      </TabsContent>
    </Tabs>
  ) : (
    <EmailVerificationCard
      callbackURL={ROUTES.home.href}
      isEmailSent={true}
      {...info}
    />
  );
}
