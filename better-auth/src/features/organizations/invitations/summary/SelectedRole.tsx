'use client';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { useFormContext, useWatch } from 'react-hook-form';
import { FaShieldAlt } from 'react-icons/fa';
import { CreateInvitationSchema } from '../create-invitation';

export function SelectedRole() {
  const { control, formState } = useFormContext<CreateInvitationSchema>();
  const role = useWatch({ control, name: 'role' });

  console.log(formState.errors)

  return (
    <Item variant='muted' size='sm' className='w-full'>
      <ItemMedia variant='icon' className='rounded-md shadow'>
        <FaShieldAlt />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Role</ItemTitle>
        <ItemDescription className='first-letter:uppercase'>
          {role}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
