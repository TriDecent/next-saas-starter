'use client';

import { OAUTH_PROVIDERS } from '@/features/auth/oauth/providers';
import {
  Badge,
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import type { Account } from 'better-auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { GoUnverified, GoVerified } from 'react-icons/go';
import { toast } from 'sonner';
import { SocialActionButton } from './SocialActionButton';

export function ConnectedAccounts({ accounts }: { accounts: Account[] }) {
  useSocialLinkErrorToast();

  return accounts && accounts.length > 0 ? (
    <div className='space-y-2.5'>
      <h3 className='mb-2 text-sm font-medium text-gray-500'>
        Connected Accounts
      </h3>
      <ItemGroup className='space-y-4'>
        {OAUTH_PROVIDERS.map(supportedProvider => {
          const isConnected = accounts.some(
            account => account.providerId === supportedProvider.name
          );

          return (
            <Item
              key={supportedProvider.name}
              variant='outline'
              size='sm'
              className='transition-transform hover:scale-105 hover:cursor-pointer active:scale-105'
              render={
                <SocialActionButton
                  provider={supportedProvider.name}
                  action={isConnected ? 'unlink' : 'link'}
                >
                  <ItemMedia variant='icon'>
                    <supportedProvider.icon />
                  </ItemMedia>

                  <ItemContent>
                    <ItemTitle className='capitalize'>
                      {supportedProvider.name}
                    </ItemTitle>
                  </ItemContent>

                  {isConnected ? (
                    <Badge variant={'success'} className='w-30 text-sm'>
                      <GoVerified />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant='destructive' className='w-30 text-sm'>
                      <GoUnverified size={'16'} />
                      Unconnected
                    </Badge>
                  )}
                </SocialActionButton>
              }
            />
          );
        })}
      </ItemGroup>
    </div>
  ) : null;
}

const ERROR_MESSAGES: Record<string, string> = {
  email_doesn_t_match:
    'The email of the social account does not match the current account email.',
  already_linked:
    'This social account has already been linked to another account.',
  oauth_failed: 'Could not link social account. Please try again.',
  account_already_linked_to_different_user:
    'This social account is already linked to a different user.',
};

function normalizeErrorCode(code: string) {
  return code.replace(/['\-]/g, '_');
}

export function useSocialLinkErrorToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get('error');
    if (!error) return;

    const normalized = normalizeErrorCode(error);
    const message = ERROR_MESSAGES[normalized] ?? `An error occurred: ${error}`;

    toast.error('Social link failed', {
      description: message,
    });

    router.replace(pathname, { scroll: false });
  }, [searchParams, pathname, router]);
}
