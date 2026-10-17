'use client';

import { DrawerOpener } from '@/shared/components/client';
import { Button, ScrollArea } from '@/shared/components/ui';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { HiMiniArrowPathRoundedSquare } from 'react-icons/hi2';
import { FactorItem } from '../_shared/FactorItem';
import { BackupCodes } from './BackupCodes';
import { GenerateBackupCodesForm } from './GenerateBackupCodesForm';

export function BackupCodeFactor() {
  const [backupCodes, setBackupCodes] = useState<readonly string[] | null>(
    null
  );

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
          <Button variant='destructive'>
            <HiMiniArrowPathRoundedSquare />
            Regenerate
          </Button>
        }
        onOpenChange={isOpen => {
          if (!isOpen) return;
          setBackupCodes(null);
        }}
      >
        {backupCodes ? (
          <ScrollArea className='mx-auto h-80 max-w-xl px-4 pb-8'>
            <BackupCodes codes={backupCodes} />
          </ScrollArea>
        ) : (
          <GenerateBackupCodesForm
            onFormSuccess={data => setBackupCodes(data.backupCodes)}
          />
        )}
      </DrawerOpener>
    </FactorItem>
  );
}
