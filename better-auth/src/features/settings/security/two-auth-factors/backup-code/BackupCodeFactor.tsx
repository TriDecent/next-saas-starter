'use client';

import { DrawerOpener } from '@/shared/components';
import { Button, ScrollArea, ScrollBar } from '@/shared/components/ui';
import { FileText } from 'lucide-react';
import { FactorActionForm } from '../_shared/FactorActionForm';
import { FactorItem } from '../_shared/FactorItem';
import { BackupCodes } from './BackupCodes';
import { generateBackupCodes } from './generate-backup-codes-action';

export function BackupCodeFactor() {
  return (
    <FactorItem
      icon={<FileText />}
      title={'Backup codes'}
      description={
        'One-time codes you can use if you lose access to your authenticator. Store them somewhere safe.'
      }
    >
      <DrawerOpener
        title={'Regenerate Backup Codes'}
        description={
          'Generating new backup codes will invalidate your old ones. Make sure to save the new codes securely.'
        }
        trigger={
          <Button variant='destructive' size='sm'>
            Regenerate
          </Button>
        }
      >
        <FactorActionForm
          action={generateBackupCodes}
          initialState={{ type: 'initial' }}
          intent={'generate-backup'}
        >
          {data => (
            <ScrollArea className='mx-auto h-80 max-w-xl px-4 pb-8'>
              <ScrollBar />
              <BackupCodes codes={data.backupCodes} />
            </ScrollArea>
          )}
        </FactorActionForm>
      </DrawerOpener>
    </FactorItem>
  );
}
