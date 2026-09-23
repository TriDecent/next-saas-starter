'use client';

import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard } from '../_shared';
import { useVerificationStore } from '../store';
import {
  SignInForm,
  type SignInErrorData,
  type SignInSuccessData,
} from './SignInForm';
import { SignInWithPasskey } from './SignInWithPasskey';
import { SocialProviders } from './SocialProviders';

export function SignInCard() {
  const setInfo = useVerificationStore(
    state => state.actions.setVerificationInfo
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSignInSuccess = (payload: SignInSuccessData) => {
    if (payload.redirect) {
      router.push(payload.redirect);
      return;
    }

    const callbackUrl = searchParams.get('callbackUrl') ?? ROUTES.home.href;
    router.replace(callbackUrl);
  };

  const handleSignInError = (payload: SignInErrorData) => {
    if (payload.status !== 'EMAIL_NOT_VERIFIED') return;

    setInfo({
      email: payload.email!, // email will be present in this case
      name: 'User',
    });
  };

  return (
    <AuthCard
      title='Sign In'
      description='Enter your credentials to access your account.'
      className='space-y-8'
    >
      <SocialProviders />

      <SignInWithPasskey />

      <SignInForm onSuccess={handleSignInSuccess} onError={handleSignInError} />

      <Button variant={'link'} asChild className='mx-auto w-full underline'>
        <Link href={ROUTES.auth.nested['reset-password'].href}>
          Forgot your password?
        </Link>
      </Button>
    </AuthCard>
  );
}
