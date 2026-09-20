'use client';

import { authClient } from '@/lib/auth/auth-client';
import type { Provider } from '@/lib/auth/constants';
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
        const { error } = await authClient.linkSocial({
          provider,
          callbackURL: pathname,
          errorCallbackURL: pathname,
        });

        if (!error) return;

        toast.error(`Link ${provider} failed`, {
          description: `${error.message}`,
        });

        return;
      }

      const { error } = await authClient.unlinkAccount({
        providerId: provider,
      });

      if (error) {
        toast.error(`Unlink account failed`, {
          description: `${error.message}`,
        });
        return;
      }

      toast.success(`Unlinked account successfully`, {
        description: `The account has been unlinked.`,
      });
      router.refresh();
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
