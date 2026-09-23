'use client';

import { authClient } from '@/lib/auth/auth-client';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/auth/constants';
import { ActionButton } from '@/shared/components';
import { ButtonGroup, ButtonGroupSeparator } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { toast } from 'sonner';

export function SocialProviders() {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get('callbackUrl') ?? ROUTES.home.href;

  return (
    <ButtonGroup className='w-full shadow-md' orientation={'horizontal'}>
      {SUPPORTED_OAUTH_PROVIDERS.map((provider, index) => (
        <Fragment key={provider.name}>
          <ActionButton
            action={async () => {
              const { error } = await authClient.signIn.social({
                provider: provider.name,
                callbackURL,
              });

              if (!error) return;

              toast.error(`Sign in failed!`, {
                description: `${error.message}`,
              });
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
