import {
  FieldDescription,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/client';
import { SelectRecipientField } from '../_shared/client';

export function SelectRecipient() {
  return (
    <FieldSet>
      <FieldLegend>2) Recipient</FieldLegend>
      <FieldDescription>
        Enter the email address of the person you want to invite.
      </FieldDescription>

      <SelectRecipientField />
    </FieldSet>
  );
}
