'use client';

import { ROLES } from '@/lib/auth/constants';
import {
  Button,
  FieldLegend,
  FieldSet,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { HiCog, HiShieldCheck, HiStar, HiUserGroup } from 'react-icons/hi';

export function SelectRole() {
  return (
    <FieldSet className='space-y-3'>
      <div className='space-y-1'>
        <FieldLegend className='text-sm font-semibold'>3) Role</FieldLegend>
        <div className='text-muted-foreground text-sm'>
          Choose what access the invited member will have.
        </div>
      </div>

      <ItemGroup className='gap-2'>
        {roles.map(role => (
          <Item key={role.value} variant='outline' className='p-3'>
            <ItemHeader>
              <div className='flex items-center gap-2'>
                <ItemMedia variant='icon' className='rounded-lg'>
                  {role.icon}
                </ItemMedia>

                <ItemContent className='min-w-0'>
                  <ItemTitle>{role.label}</ItemTitle>
                  {role.description ? (
                    <ItemDescription>{role.description}</ItemDescription>
                  ) : null}
                </ItemContent>
              </div>

              <ItemActions>
                <Button variant='outline' size='sm'>
                  Choose
                </Button>
              </ItemActions>
            </ItemHeader>
          </Item>
        ))}
      </ItemGroup>
    </FieldSet>
  );
}

const roles = [
  {
    value: ROLES['super-admin'],
    label: 'Super Admin',
    description: 'Highest level access.',
    icon: <HiShieldCheck />,
  },
  {
    value: ROLES['owner'],
    label: 'Owner',
    description: 'Full access to org.',
    icon: <HiStar />,
  },
  {
    value: ROLES['admin'],
    label: 'Admin',
    description: 'Can manage members and settings.',
    icon: <HiCog />,
  },
  {
    value: ROLES['member'],
    label: 'Member',
    description: 'Can view and collaborate.',
    icon: <HiUserGroup />,
  },
];
