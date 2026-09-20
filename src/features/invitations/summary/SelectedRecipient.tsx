'use client';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { useFormContext, useWatch } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa6';
import type { CreateInvitationSchema } from '../create-invitation';

export function SelectedRecipient() {
  const { control } = useFormContext<CreateInvitationSchema>();
  const recipient = useWatch({
    control,
    name: 'selectedRecipient',
  });

  return (
    <Item variant='muted' size='sm' className='w-full'>
      <ItemMedia variant='icon' className='rounded-md shadow'>
        <FaEnvelope />
      </ItemMedia>

      <ItemContent className='overflow-hidden'>
        <ItemTitle className='truncate'>
          {recipient?.email ?? 'No recipient selected'}
        </ItemTitle>

        <ItemDescription className='truncate'>
          {recipient
            ? [
                recipient.name || 'Unnamed user',
                recipient.role,
                recipient.emailVerified
                  ? 'email verified'
                  : 'email not verified',
              ].join(' · ')
            : 'A recipient has not been chosen yet'}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
