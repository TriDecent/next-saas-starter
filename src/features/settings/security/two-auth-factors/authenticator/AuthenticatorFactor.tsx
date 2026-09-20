'use client';

import {
  AuthenticatePriorAction,
  AuthenticatePriorContext,
} from '@/features/auth/authenticate-prior';
import { Button, ScrollArea, ScrollBar } from '@/shared/components/ui';
import { Key } from 'lucide-react';
import { use, type ReactNode } from 'react';
import { GiShield, GiShieldDisabled } from 'react-icons/gi';
import { IoIosSettings } from 'react-icons/io';
import { FactorItem } from '../_shared/FactorItem';
import { DisableTwoFactors } from './disable/DisableTwoFactors';
import { EnableTwoFactors } from './enable/EnableTwoFactors';

export function AuthenticatorFactor() {
  const context = use(AuthenticatePriorContext);
  if (!context)
    throw new Error(
      'AuthenticatePriorAction must be used within AuthenticatePriorProvider'
    );
  const { is2FAEnabled } = context;

  return (
    <FactorItem
      icon={<Key />}
      title={'Authenticator app'}
      description={
        'Recommended. Use apps like Auth Google Authenticator to generate time-based codes.'
      }
    >
      <AuthenticatePriorAction
        title={`${!is2FAEnabled ? 'Enable 2FA' : 'Disable 2FA'}`}
        description={`${
          !is2FAEnabled
            ? 'Set up two-factor authentication to add an extra layer of security to your account.'
            : 'Disabling two-factor authentication will reduce the security of your account.'
        }`}
        trigger={
          <Button
            variant={is2FAEnabled ? 'destructive' : 'default'}
            className='w-full min-w-24 sm:w-fit'
          >
            {is2FAEnabled ? (
              <>
                <GiShieldDisabled /> Disable
              </>
            ) : (
              <>
                <GiShield />
                Enable
              </>
            )}
          </Button>
        }
      >
        {!is2FAEnabled
          ? currentPassword => (
              <Wrapper>
                <EnableTwoFactors password={currentPassword} />
              </Wrapper>
            )
          : currentPassword => (
              <Wrapper>
                <DisableTwoFactors password={currentPassword} />
              </Wrapper>
            )}
      </AuthenticatePriorAction>

      <Button variant='outline' className='min-w-24'>
        <IoIosSettings />
        Manage
      </Button>
    </FactorItem>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ScrollArea className='h-80'>
      <ScrollBar />
      <div className={`mx-auto flex max-w-xl flex-col gap-y-8 px-4 pt-2 pb-12`}>
        {children}
      </div>
    </ScrollArea>
  );
}
