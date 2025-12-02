import { Button } from '@/shared/components/ui';
import { FileText } from 'lucide-react';
import { FactorItem } from '../_shared/FactorItem';

export function BackupCodeFactor() {
  return (
    <FactorItem
      icon={<FileText />}
      title={'Backup codes'}
      description={
        'One-time codes you can use if you lose access to your authenticator. Store them somewhere safe.'
      }
    >
      <Button size='sm'>View codes</Button>
      <Button variant='destructive' size='sm'>
        Regenerate
      </Button>
    </FactorItem>
  );
}
