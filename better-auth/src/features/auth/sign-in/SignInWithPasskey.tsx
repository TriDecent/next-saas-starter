'use client';

import { authClient } from '@/lib/auth';
import { MiniLoader } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useTransition } from 'react';
import { GoPasskeyFill } from 'react-icons/go';
import { toast } from 'sonner';

export function SignInWithPasskey() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSignInWithPasskey = useCallback(
    async (isAuto: boolean, signal?: AbortSignal) => {
      const { error } = await authClient.signIn.passkey({
        autoFill: isAuto,
        fetchOptions: { signal },
      });
      if (error) {
        toast.error('Failed to sign in with passkey.', {
          description: error.message,
        });
        console.log(error);
        return;
      }

      toast.success('Signed in successfully with passkey!', {
        description: 'You are now signed in.',
      });

      router.replace(callbackUrl ?? ROUTES.home.href);
    },
    [callbackUrl, router]
  );

  const handleManualClick = () =>
    startTransition(() => handleSignInWithPasskey(false));

  useEffect(() => {
    const abortController = new AbortController();
    handleSignInWithPasskey(true, abortController.signal);

    return () => abortController.abort();
  }, [handleSignInWithPasskey]);

  return (
    <Button
      className='w-full'
      disabled={isPending}
      onClick={handleManualClick}
      type='button'
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
