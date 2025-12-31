'use client';

import { authClient } from '@/lib/auth-client';
import { MiniLoader } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { GoPasskeyFill } from 'react-icons/go';
import { toast } from 'sonner';

export function SignInWithPasskey() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const handleSignInWithPasskey = () => {
    startTransition(async () => {
      const { error } = await authClient.signIn.passkey({});
      if (error) {
        toast.error('Failed to sign in with passkey.', {
          description: error.message,
        });

        return;
      }

      toast.success('Signed in successfully with passkey!', {
        description: 'You are now signed in.',
      });

      router.replace(callbackUrl ?? ROUTES.home.href);
    });
  };

  return (
    <Button
      className='w-full'
      disabled={isPending}
      onClick={handleSignInWithPasskey}
    >
      {isPending ? (
        <MiniLoader />
      ) : (
        <>
          <GoPasskeyFill />
          Sign in with passkey
        </>
      )}
    </Button>
  );
}
