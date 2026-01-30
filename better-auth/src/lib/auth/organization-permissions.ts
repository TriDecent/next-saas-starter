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
} as const satisfies Parameters<typeof organization>[0];
