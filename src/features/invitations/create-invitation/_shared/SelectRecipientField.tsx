'use client';

import { getUsersInfiniteQueryOptions } from '@/features/user/api/user-query-options';
import type { User } from '@/generated/prisma/client';
import { MiniLoader } from '@/shared/components';
import { FormField } from '@/shared/components/form/client';
import {
  Button,
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
import { PAGINATION_DEFAULTS } from '@/shared/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowDown } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa';
import type { CreateInvitationSchemaType } from '../schema';

export function SelectRecipientField() {
  const { setValue } = useFormContext<CreateInvitationSchemaType>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm);
  const { data, isError, isPending, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      ...getUsersInfiniteQueryOptions({
        keyword: debouncedSearch ? debouncedSearch : undefined, // avoid '??' to prevent caching an empty string.
        limit: PAGINATION_DEFAULTS.limit,
      }),
    });

  const users = data?.pages.flatMap(page => page.users);

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
      items={users}
      inputValue={searchTerm}
      itemToStringLabel={user => user.email}
      valueAs={user => user.email} // this value is submitted with the form
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

        <div className='text-muted-foreground mx-auto w-fit py-2 text-xs'>
          Type to search or click to load more
        </div>

        <LoadMoreButton
          disabled={
            isFetchingNextPage || !data?.pages.at(-1)?.pagination.hasNextPage
          }
          onClick={() => fetchNextPage()}
          className='mx-auto mb-3 block animate-pulse disabled:animate-none'
        />
      </ComboboxContent>
    </FormField>
  );
}

function LoadMoreButton(props: ComponentProps<typeof Button>) {
  return (
    <Button {...props}>
      <ArrowDown />
    </Button>
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
    <ComboboxList>
      <ComboboxGroup>
        <ComboboxLabel>Users</ComboboxLabel>
        <ComboboxSeparator />

        <ComboboxEmpty>No emails found.</ComboboxEmpty>

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

        <ComboboxSeparator />
      </ComboboxGroup>
    </ComboboxList>
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
