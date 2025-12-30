'use client';

import { authClient } from '@/lib/auth-client';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/o-auth-providers';
import { ActionButton } from '@/shared/components';
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAppDispatch } from '@/shared/hooks';
import { uiActions } from '@/store';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { toast } from 'sonner';
import { AuthCard } from '../_shared';
import {
  SignInForm,
  type SignInErrorData,
  type SignInSuccessData,
} from './SignInForm';

export function SignInCard() {
  const reduxDispatch = useAppDispatch();
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

    reduxDispatch(
      uiActions.toggleEmailVerification({
        email: payload.email!, // email will be present in this case
        name: 'User',
      })
    );
  };

  return (
    <AuthCard
      title='Sign In'
      description='Enter your credentials to access your account.'
      className='space-y-8'
    >
      <SocialProviders />

      <SignInForm onSuccess={handleSignInSuccess} onError={handleSignInError} />

      <Button variant={'link'} asChild className='mx-auto w-full underline'>
        <Link href={ROUTES.auth.nested['reset-password'].href}>
          Forgot your password?
        </Link>
      </Button>
    </AuthCard>
  );
}

function SocialProviders() {
  return (
    <ButtonGroup className='w-full shadow-md' orientation={'horizontal'}>
      {SUPPORTED_OAUTH_PROVIDERS.map((provider, index) => (
        <Fragment key={provider.name}>
          <ActionButton
            action={async () => {
              await authClient.signIn.social(
                {
                  provider: provider.name,
                  callbackURL: '/',
                },
                {
                  onError: error => {
                    toast.error(`Sign in failed!`, {
                      description: `${error.error.message}`,
                    });
                  },
                }
              );
            }}
            className='flex-1'
          >
            <provider.icon />
          </ActionButton>
          {index !== SUPPORTED_OAUTH_PROVIDERS.length - 1 ? (
            <ButtonGroupSeparator orientation='vertical' />
          ) : null}
        </Fragment>
      ))}
    </ButtonGroup>
  );
}
