import { sendOrganizationInvitationEmail } from '@/features/email';
import { ROUTES } from '@/shared/constants';
import { createAccessControl, type organization } from 'better-auth/plugins';
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from 'better-auth/plugins/organization/access';
import { ORG_ROLES } from './constants';

const statements = {
  ...defaultStatements,
  ['org-subscription']: [
    'upgrade-subscription',
    'list-subscription',
    'cancel-subscription',
    'restore-subscription',
    'billing-portal',
  ],
} as const;

const ac = createAccessControl(statements);

const extendedOwnerAc = ac.newRole({
  ...ownerAc.statements,
  ['org-subscription']: [
    'upgrade-subscription',
    'list-subscription',
    'cancel-subscription',
    'restore-subscription',
    'billing-portal',
  ],
});
const extendedAdminAc = ac.newRole({
  ...adminAc.statements,
  ['org-subscription']: [
    'billing-portal',
    'upgrade-subscription',
    'list-subscription',
  ],
});
const extendedMemberAc = ac.newRole({
  ...memberAc.statements,
  ['org-subscription']: ['billing-portal', 'list-subscription'],
});
const viewerMemberAc = ac.newRole({
  ac: ['read'],
  ['org-subscription']: ['list-subscription'],
});

const ROLES_STATEMENTS = {
  [ORG_ROLES.admin]: extendedAdminAc,
  [ORG_ROLES.owner]: extendedOwnerAc,
  [ORG_ROLES.member]: extendedMemberAc,
  [ORG_ROLES.viewer]: viewerMemberAc,
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
