'use client';

import type { User } from '@/generated/prisma/client';
import { MiniLoader } from '@/shared/components';
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
import { useDebounce } from '@/shared/hooks';
import { useGetUsersQuery } from '@/store/user-api';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa';
import type { CreateInvitationSchema } from './schema';

export function SelectRecipient({ recipients }: { recipients: User[] }) {
  const { setValue } = useFormContext<CreateInvitationSchema>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm);
  const { users, isFetching, isError } = useGetUsersQuery(
    { keyword: debouncedSearch },
    {
      selectFromResult: ({ data, isFetching, isError }) => ({
        isFetching,
        isError,
        users:
          data?.users.map(user => ({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            banExpires: user.banExpires ? new Date(user.banExpires) : null,
          })) ?? recipients,
      }),
    }
  );

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
        items={users}
        itemToStringLabel={user => user.email}
        valueAs={user => user.email}
        onInputValueChange={setSearchTerm}
      >
        <ComboboxContent>
          <RecipientSearchList
            usersCount={users.length}
            isFetching={isFetching}
            isError={isError}
            onSelect={user => setValue('selectedRecipient', user)}
          />
        </ComboboxContent>
      </FormField>
    </FieldSet>
  );
}

type RecipientSearchListProps = {
  usersCount: number;
  isFetching: boolean;
  isError: boolean;
  onSelect: (user: User) => void;
};

function RecipientSearchList({
  usersCount,
  isFetching,
  isError,
  onSelect,
}: RecipientSearchListProps) {
  if (isFetching)
    return (
      <div className='flex h-16 items-center'>
        <MiniLoader />
      </div>
    );

  if (isError)
    return (
      <p className='text-destructive p-4 text-center text-sm'>
        An error occurred while fetching users.
      </p>
    );

  return (
    <>
      <ComboboxEmpty>No emails found.</ComboboxEmpty>
      {usersCount > 0 ? (
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>Users</ComboboxLabel>
            <ComboboxSeparator />
            <ComboboxCollection>
              {(user: User) => (
                <ComboboxItem
                  key={user.id}
                  value={user}
                  onClick={() => onSelect(user)}
                >
                  <RecipientDisplay email={user.email} role={user.role} />
                </ComboboxItem>
              )}
            </ComboboxCollection>
            <div className='text-muted-foreground mx-auto w-fit py-2 text-xs'>
              Type to search more
            </div>
          </ComboboxGroup>
        </ComboboxList>
      ) : null}
    </>
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
