import type { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access';
import { ROLES } from './constants';

const statement = { ...defaultStatements, admin: ['access'] } as const;

const ac = createAccessControl(statement);

const extendedAdminAc = ac.newRole({
  ...adminAc.statements,
  admin: ['access'],
});
const moderatorAc = ac.newRole({ user: ['list', 'ban'], admin: ['access'] });
const extendedUserAc = ac.newRole({ ...userAc.statements });

const ROLES_STATEMENTS = {
  [ROLES['super-admin']]: extendedAdminAc,
  [ROLES.admin]: extendedAdminAc,
  [ROLES.moderator]: moderatorAc,
  user: extendedUserAc,
} as const;

export const adminPluginConfigs = {
  ac,
  roles: ROLES_STATEMENTS,
  defaultRole: 'user',
} as const satisfies Parameters<typeof admin>[0];
