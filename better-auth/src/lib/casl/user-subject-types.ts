import type { InferSubjects } from '@casl/ability';
import type { AuthSession } from '../auth';

type UserWithType = AuthSession['user'] & { kind: 'User' };
export type UserSubject = InferSubjects<UserWithType>;
export type UserAction =
  | 'ban-user'
  | 'revoke-user'
  | 'impersonate-user'
  | 'delete-account'
  | 'set-role';
