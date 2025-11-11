'use client';
import { EmailVerificationCard } from '@/features/email';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui';
import { useAppSelector } from '@/features/shared/hooks';
import { SigninCard } from './SigninCard';
import { SignupCard } from './SignupCard';

export function AuthCardSelection() {
  const verificationInfo = useAppSelector(state => state.ui.verificationInfo);

  return !verificationInfo ? (
    <Tabs defaultValue='signin' className='mx-auto max-w-xl'>
      <TabsList>
        <TabsTrigger value='signin'>Sign In</TabsTrigger>
        <TabsTrigger value='signup'>Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value='signin'>
        <SigninCard />
      </TabsContent>

      <TabsContent value='signup'>
        <SignupCard />
      </TabsContent>
    </Tabs>
  ) : (
    <EmailVerificationCard {...verificationInfo} expiresIn='1h' />
  );
}
