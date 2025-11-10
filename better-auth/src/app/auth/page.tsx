'use client';
import { SigninCard, SignupCard } from '@/features/auth';
import { EmailVerificationCard } from '@/features/email';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui';
import { useAppSelector } from '@/features/shared/hooks';

export default function AuthPage() {
  const verificationInfo = useAppSelector(state => state.ui.verificationInfo);

  return (
    <section className='space-y-8'>
      <h2 className='text-xl font-medium'>Authentication page</h2>

      {!verificationInfo ? (
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
      )}
    </section>
  );
}
