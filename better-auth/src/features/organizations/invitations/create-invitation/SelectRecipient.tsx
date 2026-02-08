'use client';

import type { User } from '@/generated/prisma/client';
import { FormField } from '@/shared/components/form';
import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  FieldDescription,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { useFormContext } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa';
import type { CreateInvitationSchema } from './schema';

export function SelectRecipient({ recipients }: { recipients: User[] }) {
  const { setValue } = useFormContext<CreateInvitationSchema>();

  return (
    <FieldSet>
      <FieldLegend>2) Recipient</FieldLegend>
      <FieldDescription>
        Enter the email address of the person you want to invite.
      </FieldDescription>

      <FormField<User>
        kind='combobox'
        id='email'
        name='email'
        labelText='Email'
        placeholder='name@company.com'
        description='Tip: you can invite external emails too.'
        addons={
          <InputGroupAddon>
            <FaEnvelope />
          </InputGroupAddon>
        }
        autoComplete='email'
        items={recipients}
        itemToStringLabel={user => user.email}
        valueAs={user => user.email}
      >
        <ComboboxContent>
          <ComboboxEmpty>No emails found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxGroup>
              <ComboboxLabel>Users</ComboboxLabel>
              <ComboboxSeparator />

              <ComboboxCollection>
                {(user: User) => (
                  <ComboboxItem
                    key={user.id}
                    value={user}
                    onClick={() => setValue('selectedRecipient', user)}
                  >
                    <RecipientDisplay email={user.email} role={user.role} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </FormField>
    </FieldSet>
  );
}

function RecipientDisplay({ email, role }: { email: string; role: string }) {
  return (
    <p className='flex w-full items-center gap-2'>
      <span className='font-medium'>{email}</span>

      <span className='text-muted-foreground phone-lg:inline-block hidden text-xs opacity-75'>
        — {role}
      </span>
    </p>
  );
}
