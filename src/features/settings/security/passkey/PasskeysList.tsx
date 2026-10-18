import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  ItemGroup,
  Separator,
} from '@/shared/components/ui';
import type { Passkey } from '@better-auth/passkey';
import { MdDevices } from 'react-icons/md';
import { AddPasskeyButton } from './AddPasskeyButton';
import { PasskeyItem } from './PasskeyItem';

export type CredentialDeviceType = 'platform' | 'cross-platform' | string;

export function PasskeysList({ passkeys }: { passkeys: Passkey[] }) {
  return passkeys.length > 0 ? (
    <Passkeys passkeys={passkeys} />
  ) : (
    <EmptyPasskey />
  );
}

function Passkeys({ passkeys }: { passkeys: Passkey[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Passkeys</CardTitle>
        <CardDescription>
          Registered credentials for passwordless sign-in.
        </CardDescription>
        <CardAction>
          <AddPasskeyButton />
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        <ItemGroup className='space-y-4'>
          {passkeys.map(passkey => (
            <PasskeyItem passkey={passkey} key={passkey.id} />
          ))}
        </ItemGroup>
      </CardContent>

      <CardFooter className='text-muted-foreground justify-center text-center text-xs'>
        Click any badge to learn more.
      </CardFooter>
    </Card>
  );
}

function EmptyPasskey() {
  return (
    <Empty className='border'>
      <EmptyMedia variant={'icon'}>
        <MdDevices />
      </EmptyMedia>
      <EmptyTitle>No passkeys registered</EmptyTitle>
      <EmptyDescription>
        Register a passkey from a supported device to enable passwordless login.
      </EmptyDescription>
      <EmptyContent>
        <AddPasskeyButton />
      </EmptyContent>
    </Empty>
  );
}
