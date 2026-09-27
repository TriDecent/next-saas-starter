import {
  FieldDescription,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/client';
import { SelectRoleField } from '../_shared/client';

export function SelectRole() {
  return (
    <FieldSet>
      <FieldLegend className='text-sm font-semibold'>3) Role</FieldLegend>
      <FieldDescription className='text-muted-foreground text-sm'>
        Choose what access the invited member will have.
      </FieldDescription>

      <SelectRoleField />
    </FieldSet>
  );
}
