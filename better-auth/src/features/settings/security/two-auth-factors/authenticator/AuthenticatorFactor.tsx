import { DrawerOpener } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { Key } from 'lucide-react';
import { FactorItem } from '../_shared/FactorItem';
import { DisableTwoFactors } from './disable/DisableTwoFactors';
import { EnableTwoFactors } from './enable/EnableTwoFactors';

export function AuthenticatorFactor({ isEnabled }: { isEnabled: boolean }) {
  return (
    <FactorItem
      icon={<Key />}
      title={'Authenticator app'}
      description={
        'Recommended. Use apps like Auth Google Authenticator to generate time-based codes.'
      }
    >
      <DrawerOpener
        title={`${!isEnabled ? 'Enable 2FA' : 'Disable 2FA'}`}
        description={`${
          !isEnabled
            ? 'Set up two-factor authentication to add an extra layer of security to your account.'
            : 'Disabling two-factor authentication will reduce the security of your account.'
        }`}
        trigger={
          <span>
            <Button variant={isEnabled ? 'destructive' : 'default'} size={'sm'}>
              {isEnabled ? 'Disable' : 'Enable'}
            </Button>
          </span>
        }
      >
        {!isEnabled ? <EnableTwoFactors /> : <DisableTwoFactors />}
      </DrawerOpener>

      <Button variant='outline' size='sm'>
        Manage
      </Button>
    </FactorItem>
  );
}
