'use client';

import type { Provider } from '@/lib';
import { authClient } from '@/lib/auth-client';
import { MiniLoader } from '@/shared/components';
import { usePathname } from 'next/navigation';
import { useTransition, type ComponentProps } from 'react';
import { toast } from 'sonner';

export function SocialLoginButton({
  provider,
  ...props
}: {
  provider: Provider;
} & ComponentProps<'button'>) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await authClient.linkSocial(
            {
              provider,
              callbackURL: pathname,
              errorCallbackURL: pathname,
            },
            {
              onError: error => {
                toast.error(`Link ${provider} failed`, {
                  description: `${error.error.message}`,
                });
              },
            }
          );
        })
      }
      disabled={isPending ?? props.disabled}
      {...props}
    >
      {!isPending ? props.children : <MiniLoader />}
    </button>
  );
}
