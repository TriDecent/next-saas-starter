'use client';

import { FormField } from '@/shared/components/form';
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { FaEnvelope } from 'react-icons/fa';

export function SelectRecipient() {
  return (
    <FieldSet>
      <FieldLegend>2) Recipient</FieldLegend>
      <FieldDescription>
        Enter the email address of the person you want to invite.
      </FieldDescription>

      <FormField
        kind='input'
        id='email'
        name='email'
        labelText='Email'
        placeholder='name@company.com'
        inputMode='email'
        autoComplete='email'
        description='Tip: you can invite external emails too.'
        addons={
          <InputGroupAddon>
            <FaEnvelope />
          </InputGroupAddon>
        }
      />
    </FieldSet>
  );
}
