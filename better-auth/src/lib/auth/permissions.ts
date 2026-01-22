import type { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = { ...defaultStatements, admin: ['access'] } as const;

const ac = createAccessControl(statement);

const adminRole = ac.newRole({ ...adminAc.statements, admin: ['access'] });
const moderatorRole = ac.newRole({ user: ['list', 'ban'], admin: ['access'] });
// const userRole = ac.newRole({});

export const ROLES = { admin: 'admin', moderator: 'moderator', user: 'user' };

const ROLES_STATEMENTS = {
  [ROLES.admin]: adminRole,
  [ROLES.moderator]: moderatorRole,
  // user: userRole
} as const;

export const adminPluginConfigs = {
  ac,
  roles: ROLES_STATEMENTS,
  defaultRole: 'user',
} satisfies Parameters<typeof admin>[0];
