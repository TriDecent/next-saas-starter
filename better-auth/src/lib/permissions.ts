import type { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = { ...defaultStatements, admin: ['access'] } as const;

export const ac = createAccessControl(statement);

const adminRole = ac.newRole({ ...adminAc.statements, admin: ['access'] });
const moderatorRole = ac.newRole({ user: ['list', 'ban'], admin: ['access'] });
// const userRole = ac.newRole({});

const ROLES = {
  admin: adminRole,
  moderator: moderatorRole,
  // user: userRole
} as const;

export const adminPluginConfigs = {
  ac,
  roles: ROLES,
  defaultRole: 'user',
} satisfies Parameters<typeof admin>[0];
