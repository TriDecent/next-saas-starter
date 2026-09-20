import { HiOfficeBuilding, HiUser, HiUserGroup } from 'react-icons/hi';

export const INVITATION_STEPS = [
  {
    title: 'Organization',
    description: 'Confirm the organization to send invitation from.',
    icon: HiOfficeBuilding,
    field: 'organizationId',
  },
  {
    title: 'Recipient',
    description: 'Choose who should receive this invitation.',
    icon: HiUser,
    field: 'email',
  },
  {
    title: 'Role',
    description: 'Set the access level for the invited user.',
    icon: HiUserGroup,
    field: 'role',
  },
] as const;
