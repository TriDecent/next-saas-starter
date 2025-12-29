'use client';

import { Button, ScrollArea, ScrollBar } from '@/shared/components/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { VscDebugContinue } from 'react-icons/vsc';
import QRCode from 'react-qr-code';
import { BackupCodes } from '../../backup-code';
import { VerifyTotp } from '../verify-totp';
import { EnableTwoFactorsForm } from './EnableTwoFactorsForm';
import type { enableTwoFactorsAction } from './enable-two-factors-action';

type TotpData = Extract<
  Awaited<ReturnType<typeof enableTwoFactorsAction>>,
  { type: 'success' }
>['payload'];

export function EnableTwoFactors() {
  const [totpData, setTotpData] = useState<TotpData | null>(null);

  return totpData ? (
    <ScrollArea className='h-80'>
      <ScrollBar />
      <div className={`mx-auto flex max-w-xl flex-col gap-y-8 px-4 pt-2 pb-12`}>
        <TotpSetup totpData={totpData} />
      </div>
    </ScrollArea>
  ) : (
    <EnableTwoFactorsForm onFormSuccess={data => setTotpData(data)} />
  );
}

function TotpSetup({ totpData }: { totpData: TotpData }) {
  const [shouldContinue, setShouldContinue] = useState(false);
  const [isVerifiedTotp, setIsVerifiedTotp] = useState(false);
  const router = useRouter();

  return (
    <>
      {!shouldContinue || isVerifiedTotp ? (
        <>
          <TotpUriQR uri={totpData.totpURI} />
          <BackupCodes codes={totpData.backupCodes} />
        </>
      ) : (
        <VerifyTotp
          onVerifySuccess={() => {
            setIsVerifiedTotp(true);
            router.refresh();
          }}
        />
      )}

      {!isVerifiedTotp ? (
        <Button
          onClick={() => setShouldContinue(state => !state)}
          variant={'outline'}
          className={`mt-auto w-full sm:w-fit ${shouldContinue ? 'sm:mr-auto' : 'sm:ml-auto'}`}
        >
          {!shouldContinue ? (
            <>
              Continue <VscDebugContinue />
            </>
          ) : (
            <>
              Return <VscDebugContinue className='rotate-180' />
            </>
          )}
        </Button>
      ) : null}
    </>
  );
}

function TotpUriQR({ uri }: { uri: string }) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <p className='text-center text-sm'>
        Scan the QR code below with your authenticator app.
      </p>

      <div className='bg-foreground/5 rounded-md border p-4'>
        <QRCode value={uri} className='size-36' />
      </div>
    </div>
  );
}
