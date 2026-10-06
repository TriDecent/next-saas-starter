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
import type { CreateInvitationSchemaType } from '../create-invitation';

export function SelectedRole() {
  const { control } = useFormContext<CreateInvitationSchemaType>();
  const role = useWatch({ control, name: 'role' });

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
