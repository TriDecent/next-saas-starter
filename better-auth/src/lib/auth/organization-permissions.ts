import { sendOrganizationInvitationEmail } from '@/features/email';
import { ROUTES } from '@/shared/constants';
import { createAccessControl, type organization } from 'better-auth/plugins';
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from 'better-auth/plugins/organization/access';
import { ROLES } from './constants';

const statements = { ...defaultStatements } as const;

const ac = createAccessControl(statements);

const extendedOwnerAc = ac.newRole({ ...ownerAc.statements });
const extendedAdminAc = ac.newRole({ ...adminAc.statements });
const extendedMemberAc = ac.newRole({ ...memberAc.statements });

const ROLES_STATEMENTS = {
  [ROLES['super-admin']]: extendedOwnerAc,
  [ROLES.admin]: extendedAdminAc,
  [ROLES.owner]: extendedOwnerAc,
  member: extendedMemberAc,
} as const;

export const organizationPluginConfigs = {
  ac,
  roles: ROLES_STATEMENTS,
  sendInvitationEmail: async data => {
    const acceptUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.invitations.href}/${data.invitation.id}`;
    console.log(acceptUrl);

    void sendOrganizationInvitationEmail({
      recipientEmail: data.email,
      organizationName: data.organization.name,
      inviterName: data.inviter.user.name,
      inviterEmail: data.inviter.user.email,
      roleLabel: data.invitation.role,
      expiresAt: data.invitation.expiresAt,
      acceptUrl,
    });
  },
} as const satisfies Parameters<typeof organization>[0];
