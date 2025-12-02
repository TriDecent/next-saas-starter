import { Button } from '@/shared/components/ui';
import { Smartphone } from 'lucide-react';
import { FactorItem } from '../_shared/FactorItem';

export function SmsFactor() {
  return (
    <FactorItem
      icon={<Smartphone />}
      title={"SMS (not recommended - I'm poor 😭)"}
      description={
        'Receive codes via SMS. Less secure than authenticator apps.'
      }
    >
      <Button size='sm' disabled>
        Enable
      </Button>
      <Button variant='outline' size='sm' disabled>
        Manage
      </Button>
    </FactorItem>
  );
}
