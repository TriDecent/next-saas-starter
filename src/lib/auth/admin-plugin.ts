import { APP_ROLES } from '@/features/authorization';
import type { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
  admin: ['access'],
  organization: ['create'],
  invitation: ['create'],
} as const;

const ac = createAccessControl(statement);

const extendedAdminAc = ac.newRole({
  ...adminAc.statements,
  admin: ['access'],
  invitation: ['create'],

  organization: ['create'],
});
const moderatorAc = ac.newRole({
  user: ['list', 'ban', 'get'],
  admin: ['access'],
  invitation: ['create'],

  organization: ['create'],
});
const extendedUserAc = ac.newRole({
  ...userAc.statements,
  user: ['get'],
});

const ROLES_STATEMENTS = {
  [APP_ROLES['super-admin']]: extendedAdminAc,
  [APP_ROLES.admin]: extendedAdminAc,
  [APP_ROLES.moderator]: moderatorAc,
  user: extendedUserAc,
} as const;

export const adminPluginConfigs = {
  ac,
  roles: ROLES_STATEMENTS,
  defaultRole: 'user',
} as const satisfies Parameters<typeof admin>[0];
