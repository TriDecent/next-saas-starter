'use client';

import { BackupCodes } from '@/features/settings/security/two-auth-factors/backup-code';
import { Button, ScrollArea, ScrollBar } from '@/shared/components/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { VscDebugContinue } from 'react-icons/vsc';
import QRCode from 'react-qr-code';
import { FactorActionForm } from '../../_shared/FactorActionForm';
import { VerifyTotp } from './VerifyTotp';
import { enableTwoFactorsAction } from './enable-two-factors-action';

export function EnableTwoFactors() {
  const [shouldContinue, setShouldContinue] = useState(false);
  const [isVerifiedTotp, setIsVerifiedTotp] = useState(false);
  const router = useRouter();

  return (
    <FactorActionForm
      action={enableTwoFactorsAction}
      intent={'enable'}
      initialState={{ type: 'initial' }}
    >
      {data => (
        <ScrollArea className='h-80'>
          <ScrollBar />
          <div
            className={`mx-auto flex max-w-xl flex-col gap-y-8 px-4 pt-2 pb-12 ${shouldContinue && !isVerifiedTotp ? 'h-80' : ''}`}
          >
            {!shouldContinue || isVerifiedTotp ? (
              <>
                <TotpUriQR uri={data.totpURI} />
                <BackupCodes codes={data.backupCodes} />
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
          </div>
        </ScrollArea>
      )}
    </FactorActionForm>
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
