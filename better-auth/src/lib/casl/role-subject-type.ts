import type { InferSubjects } from '@casl/ability';
import type { AppRole } from '../auth';

type RoleWithType = { name: AppRole } & { kind: 'Role' };
export type RoleSubject = InferSubjects<RoleWithType>;
export type RoleActionsType = 'assign';
