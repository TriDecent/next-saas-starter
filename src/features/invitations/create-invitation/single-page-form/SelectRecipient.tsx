import type { User } from '@/generated/prisma/client';
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui';
import { SelectRecipientField } from '../_shared';

export function SelectRecipient({ recipients }: { recipients: User[] }) {
  return (
    <FieldSet>
      <FieldLegend>2) Recipient</FieldLegend>
      <FieldDescription>
        Enter the email address of the person you want to invite.
      </FieldDescription>

      <SelectRecipientField recipients={recipients} />
    </FieldSet>
  );
}
