'use client';

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ScrollArea,
} from '@/shared/components/ui';
import { AlertCircle } from 'lucide-react';
import { EOL } from 'os';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { VscDebugContinue } from 'react-icons/vsc';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { FactorActionForm } from '../FactorActionForm';
import { enableTwoFactorsAction } from './enable-two-factors-action';
import { VerifyTotp } from './VerifyTotp';

export function EnableTwoFactors() {
  const [shouldContinue, setShouldContinue] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <FactorActionForm
      action={enableTwoFactorsAction}
      intent={'enable'}
      initialState={{ type: 'initial' }}
    >
      {data => {
        return (
          <ScrollArea className='h-80'>
            <div
              className={`mx-auto flex max-w-xl flex-col gap-y-8 px-4 pt-2 pb-12 ${shouldContinue ? 'h-80' : ''}`}
            >
              {!shouldContinue ? (
                <>
                  <TotpUriQR uri={data.totpURI} />
                  <BackupCodes codes={data.backupCodes} />
                </>
              ) : (
                <VerifyTotp onVerifySuccess={() => setIsEnabled(true)} />
              )}

              <Button
                onClick={() => setShouldContinue(state => !state)}
                variant={'outline'}
                className={`mt-auto w-full sm:w-fit ${shouldContinue ? 'sm:mr-auto' : 'sm:ml-auto'}`}
              >
                {!shouldContinue && !isEnabled ? (
                  <>
                    Continue <VscDebugContinue />
                  </>
                ) : (
                  <>
                    Return <VscDebugContinue className='rotate-180' />
                  </>
                )}
              </Button>
            </div>
          </ScrollArea>
        );
      }}
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

function BackupCodes({ codes }: { codes: readonly string[] }) {
  const handleCopyCodes = async () => {
    await navigator.clipboard.writeText(codes.join(EOL));
    toast.success('Backup codes copied to clipboard');
  };

  const handleDownloadCodes = () => {
    const blobParts = codes.flatMap(code => [code, EOL]);
    const blob = new Blob(blobParts);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'backup-codes.txt';
    a.click();
    toast.success('Backup codes downloaded');

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <InputGroup>
      <InputGroupAddon align={'block-start'}>
        <InputGroupText>
          <h4 className='font-medium'>Backup codes</h4>
        </InputGroupText>
        <ButtonGroup className='ml-auto'>
          <InputGroupButton
            variant={'secondary'}
            onClick={handleCopyCodes}
            size={'sm'}
          >
            <FiCopy />
            Copy
          </InputGroupButton>

          <ButtonGroupSeparator />

          <InputGroupButton
            onClick={handleDownloadCodes}
            variant={'secondary'}
            size={'sm'}
          >
            <IoCloudDownloadOutline />
            Download
          </InputGroupButton>
        </ButtonGroup>
      </InputGroupAddon>
      <InputGroupTextarea
        readOnly
        value={codes.join(EOL)}
        className='text-xs'
      />

      <InputGroupAddon align={'block-end'}>
        <BackupCodesWarning />
      </InputGroupAddon>
    </InputGroup>
  );
}

function BackupCodesWarning() {
  return (
    <Item size={'sm'} variant={'warning'} className=''>
      <ItemMedia>
        <AlertCircle />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Backup codes are shown only once</ItemTitle>
        <ItemDescription>
          Please copy or download your backup codes now and store them in a safe
          place. You will need them if you lose your device or cannot access
          your authenticator app.
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
