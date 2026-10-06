'use client';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { useFormContext, useWatch } from 'react-hook-form';
import { FaBuilding } from 'react-icons/fa6';
import { CreateInvitationSchemaType } from '../create-invitation';

export function SelectedOrgItem() {
  const { control } = useFormContext<CreateInvitationSchemaType>();
  const organization = useWatch({
    control,
    name: 'selectedOrganization',
  });

  return (
    <Item variant='muted' size='sm' className='w-full'>
      <ItemMedia variant='icon' className='rounded-md shadow'>
        <FaBuilding />
      </ItemMedia>

      <ItemContent className='overflow-hidden'>
        <ItemTitle>
          {organization?.name ?? 'No organization selected'}
        </ItemTitle>

        <ItemDescription className='truncate'>
          {organization
            ? `${organization!.slug} · ${organization!.id}`
            : 'An organization has not been chosen yet'}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
