'use client';

import { ToolTipPopover } from '@/shared/components';
import {
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import type { Passkey } from '@better-auth/passkey';
import { formatDistanceToNow } from 'date-fns';
import {
  Bluetooth,
  CheckCircle2,
  Copy,
  Fingerprint,
  KeyRound,
  Laptop,
  ShieldCheck,
  Smartphone,
  Usb,
  Wifi,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { DeletePassKeyButton } from './DeletePassKeyButton';

export function PasskeyItem({ passkey }: { passkey: Passkey }) {
  return (
    <Item variant='outline'>
      <ItemMedia variant='icon' className='size-10 rounded-full'>
        {getPasskeyMainIcon(passkey)}
      </ItemMedia>

      <ItemContent>
        <ItemTitle className='text-base font-semibold'>
          {passkey.name || 'Unnamed Passkey'}

          <BackedUpBadge isBackedUp={passkey.backedUp} />
        </ItemTitle>

        <DeviceBadge deviceType={passkey.deviceType} />

        <ItemDescription className='space-y-0.5'>
          <span>
            Added {formatDistanceToNow(passkey.createdAt, { addSuffix: true })}
          </span>

          <span className='flex items-center gap-2'>
            {passkey.transports ? (
              <>
                <span className='text-muted-foreground/70'>via:</span>
                {getTransportBadges(passkey.transports)}
              </>
            ) : (
              <span>Unknown transport</span>
            )}
          </span>
        </ItemDescription>

        <code className='bg-muted text-muted-foreground phone-lg:max-w-fit max-w-50 truncate rounded px-1.5 py-0.5 font-mono text-xs'>
          ID: {passkey.id}
        </code>
      </ItemContent>

      <ItemActions className='self-items-start ml-auto'>
        <Button
          variant='ghost'
          size='icon-lg'
          onClick={async () => {
            await navigator.clipboard.writeText(JSON.stringify(passkey));
            toast.success('Passkey information copied to clipboard');
          }}
        >
          <Copy className='size-4' />
        </Button>

        <DeletePassKeyButton passkeyId={passkey.id} />
      </ItemActions>
    </Item>
  );
}

function BackedUpBadge({ isBackedUp }: { isBackedUp: boolean }) {
  return (
    <ToolTipPopover
      message={
        isBackedUp
          ? 'This passkey is synced across your devices'
          : 'This passkey is stored only on this device'
      }
    >
      <Badge variant='secondary' className='ml-auto'>
        <CheckCircle2 /> {isBackedUp ? 'Synced' : 'Unsynced'}
      </Badge>
    </ToolTipPopover>
  );
}

function DeviceBadge({ deviceType }: { deviceType: Passkey['deviceType'] }) {
  return (
    <ToolTipPopover
      message={
        deviceType === 'singleDevice'
          ? 'This passkey is bound to a single device and cannot be moved'
          : 'This passkey can be used across multiple devices'
      }
    >
      <Badge variant='outline'>
        {deviceType === 'singleDevice' ? <ShieldCheck /> : <KeyRound />}
        {deviceType === 'singleDevice' ? 'Device Bound' : 'Cross-platform'}
      </Badge>
    </ToolTipPopover>
  );
}

const getPasskeyMainIcon = (passkey: Passkey) => {
  const transports = passkey.transports?.split(',').map(t => t.trim()) || [];

  if (transports.includes('usb'))
    return <Usb className='size-6 text-blue-500' />;
  if (transports.includes('nfc'))
    return <Wifi className='size-6 text-orange-500' />;

  if (passkey.deviceType !== 'singleDevice')
    return <KeyRound className='size-6 text-indigo-500' />;

  if (transports.includes('internal'))
    return <Fingerprint className='size-6 text-emerald-500' />;

  return <Laptop className='size-6 text-slate-500' />;
};

const getTransportBadges = (transportsStr?: string) => {
  if (!transportsStr) return null;
  const list = transportsStr.split(',').map(t => t.trim());

  const icons: Record<string, ReactNode> = {
    usb: <Usb size={12} />,
    nfc: <Wifi size={12} />,
    ble: <Bluetooth size={12} />,
    internal: <Fingerprint size={12} />,
    hybrid: <Smartphone size={12} />,
  };

  return (
    <span className='mt-1 flex gap-1'>
      {list.map(t =>
        icons[t] ? (
          <span
            key={t}
            className='bg-muted text-muted-foreground ring-border/50 flex size-5 items-center justify-center rounded-full ring-1'
            title={t}
          >
            {icons[t]}
          </span>
        ) : null
      )}
    </span>
  );
};
