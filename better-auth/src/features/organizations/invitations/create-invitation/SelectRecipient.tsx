'use client';

import type { User } from '@/generated/prisma/client';
import { FormField } from '@/shared/components/form';
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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

      <FormField
        kind='select'
        id='email'
        name='email'
        labelText='Email'
        placeholder='name@company.com'
        description='Tip: you can invite external emails too.'
        addons={
          <InputGroupAddon className='pl-0'>
            <FaEnvelope />
          </InputGroupAddon>
        }
      >
        <SelectContent position='item-aligned' className='truncate'>
          <SelectGroup>
            <SelectLabel>Users</SelectLabel>
            <SelectSeparator />

            {recipients.map(recipient => (
              <SelectItem
                key={recipient.id}
                value={recipient.email}
                onClick={() => setValue('selectedRecipient', recipient)}
              >
                <RecipientDisplay
                  email={recipient.email}
                  role={recipient.role}
                />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
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
