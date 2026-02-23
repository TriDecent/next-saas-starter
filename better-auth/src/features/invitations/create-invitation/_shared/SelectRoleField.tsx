'use client';

import { ORG_ROLES } from '@/lib/auth/constants';
import { FormField } from '@/shared/components/form';
import {
  FieldContent,
  FieldLabel,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
  RadioGroupItem,
} from '@/shared/components/ui';
import { HiCog, HiEye, HiStar, HiUserGroup } from 'react-icons/hi';

export function SelectRoleField() {
  return (
    <ItemGroup className='gap-3'>
      <FormField kind='radio' name='role' id='role'>
        {({ isDisabled, isError }) =>
          roles.map(role => (
            <FieldLabel key={role.value} className='w-full rounded-md'>
              <FieldContent>
                <RoleDisplay
                  role={role}
                  renderActions={
                    <RadioGroupItem
                      value={role.value}
                      disabled={isDisabled}
                      aria-invalid={isError}
                    />
                  }
                />
              </FieldContent>
            </FieldLabel>
          ))
        }
      </FormField>
    </ItemGroup>
  );
}

function RoleDisplay({
  role,
  renderActions,
}: {
  role: Role;
  renderActions: React.ReactNode;
}) {
  return (
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

        <ItemActions>{renderActions}</ItemActions>
      </ItemHeader>
    </Item>
  );
}

type Role = (typeof roles)[number];

const roles = [
  {
    value: ORG_ROLES['owner'],
    label: 'Owner',
    description: 'Full access to org.',
    icon: <HiStar />,
  },
  {
    value: ORG_ROLES['admin'],
    label: 'Admin',
    description: 'Can manage members and settings.',
    icon: <HiCog />,
  },
  {
    value: ORG_ROLES['member'],
    label: 'Member',
    description: 'Can view and collaborate.',
    icon: <HiUserGroup />,
  },
  {
    value: ORG_ROLES['viewer'],
    label: 'Viewer',
    description: 'Read-only access to org.',
    icon: <HiEye />,
  },
];
