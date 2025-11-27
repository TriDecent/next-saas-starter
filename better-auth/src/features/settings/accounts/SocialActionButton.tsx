'use client';

import type { Provider } from '@/lib';
import { authClient } from '@/lib/auth-client';
import { MiniLoader } from '@/shared/components';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition, type ComponentProps } from 'react';
import { toast } from 'sonner';

type SocialActionButtonProps = {
  provider: Provider;
  action: 'link' | 'unlink';
} & ComponentProps<'button'>;

export function SocialActionButton({
  provider,
  action,
  ...props
}: SocialActionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () =>
    startTransition(async () => {
      if (action === 'link') {
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

        return;
      }

      await authClient.unlinkAccount(
        { providerId: provider },
        {
          onError: error => {
            toast.error(`Unlink account failed`, {
              description: `${error.error.message}`,
            });
          },
          onSuccess: () => {
            toast.success(`Unlinked account successfully`, {
              description: `The account has been unlinked.`,
            });
            router.refresh();
          },
        }
      );
    });

  return (
    <button
      onClick={handleClick}
      disabled={isPending || props.disabled}
      {...props}
    >
      {!isPending ? props.children : <MiniLoader />}
    </button>
  );
}
