'use client';

import { getUsersQueryOptions } from '@/features/user';
import type { User } from '@/generated/prisma/client';
import { MiniLoader } from '@/shared/components';
import { FormField } from '@/shared/components/form/client';
import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  InputGroupAddon,
} from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks/client';
import { PAGINATION_DEFAULTS } from '@/shared/utils';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa';
import type { CreateInvitationSchema } from './schema';

export function SelectRecipientField() {
  const { setValue } = useFormContext<CreateInvitationSchema>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm);
  const { data, isError, isPending } = useQuery({
    ...getUsersQueryOptions({
      keyword: debouncedSearch ? debouncedSearch : undefined,
      page: PAGINATION_DEFAULTS.page,
      limit: PAGINATION_DEFAULTS.limit,
    }),
  });

  return (
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
      items={data?.users}
      inputValue={searchTerm}
      itemToStringLabel={user => user.email}
      valueAs={user => user.email}
      onInputValueChange={setSearchTerm}
    >
      <ComboboxContent>
        <RecipientSearchList
          isFetching={isPending}
          isError={isError}
          onSelect={user => {
            setValue('selectedRecipient', user);
            setSearchTerm(user.email);
          }}
        />
      </ComboboxContent>
    </FormField>
  );
}

type RecipientSearchListProps = {
  isFetching: boolean;
  isError: boolean;
  onSelect: (user: User) => void;
};

function RecipientSearchList({
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
