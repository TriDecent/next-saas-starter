import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ItemGroup,
  Separator,
} from '@/shared/components/ui';
import { ShieldCheck } from 'lucide-react';
import { AuthenticatorFactor } from './authenticator/AuthenticatorFactor';
import { BackupCodeFactor } from './backup-code/BackupCodeFactor';
import { SmsFactor } from './sms/SmsFactor';
import { Toggle2FA } from './toggle-2fa/Toggle2FA';

export function TwoFactorsCard({ isEnabled }: { isEnabled: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-5' />
            Two-Factor Authentication
          </div>

          <div className='flex items-center gap-4'>
            <Badge
              variant={isEnabled ? 'success' : 'destructive'}
              className='flex items-center gap-3 rounded-full px-3 py-1'
            >
              <span className='text-xs'>
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>

              <Toggle2FA isEnabled={isEnabled} />
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account. Manage methods and
          backup codes below.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <ItemGroup className='space-y-4'>
          <AuthenticatorFactor />

          <SmsFactor />

          <BackupCodeFactor />
        </ItemGroup>
      </CardContent>

      <Separator />

      <CardFooter className='text-muted-foreground text-xs'>
        Enabling 2FA helps protect your account. We recommend using an
        authenticator app instead of SMS.
      </CardFooter>
    </Card>
  );
}
