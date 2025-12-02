'use client';

import {
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
} from '@/shared/components/ui';
import { AlertCircle } from 'lucide-react';
import { EOL } from 'os';
import { FiCopy } from 'react-icons/fi';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { toast } from 'sonner';

export function BackupCodes({ codes }: { codes: readonly string[] }) {
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
