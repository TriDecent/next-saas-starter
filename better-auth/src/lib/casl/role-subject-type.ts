import type { InferSubjects } from '@casl/ability';
import type { AppRoles } from '../auth';

type RoleWithType = { name: AppRoles } & { kind: 'Role' };
export type RoleSubject = InferSubjects<RoleWithType>;
export type RoleActionsType = 'assign';
