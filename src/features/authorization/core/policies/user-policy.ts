import type { InferSubjects } from '@casl/ability';
import type { AuthSession } from '../../../../lib/auth';
import { defineAbilityFor } from '../ability';

type BaseUser = AuthSession['user'];
type UserWithType = BaseUser & { kind: 'User' };
export type UserSubject = InferSubjects<UserWithType>;
export type UserAction =
  | 'ban-user'
  | 'revoke-user'
  | 'impersonate-user'
  | 'delete-account'
  | 'set-role'
  | 'change-email'
  | 'change-password'
  | 'export-users'
  | 'enable-2fa';

export function getUserPolicyFor(actor: AuthSession['user']) {
  const ability = defineAbilityFor(actor);

  return {
    canRead: (user?: BaseUser) =>
      user
        ? ability.can('read', { ...user, kind: 'User' })
        : ability.can('read', 'User'),
    canBan: (user?: BaseUser) =>
      user
        ? ability.can('ban-user', { ...user, kind: 'User' })
        : ability.can('ban-user', 'User'),
    canRevoke: (user?: BaseUser) =>
      user
        ? ability.can('revoke-user', { ...user, kind: 'User' })
        : ability.can('revoke-user', 'User'),
    canImpersonate: (user?: BaseUser) =>
      user
        ? ability.can('impersonate-user', { ...user, kind: 'User' })
        : ability.can('impersonate-user', 'User'),
    canDeleteAccount: (user?: BaseUser) =>
      user
        ? ability.can('delete-account', { ...user, kind: 'User' })
        : ability.can('delete-account', 'User'),
    canSetRole: (user?: BaseUser) =>
      user
        ? ability.can('set-role', { ...user, kind: 'User' })
        : ability.can('set-role', 'User'),
    canDelete: (user?: BaseUser) =>
      user
        ? ability.can('delete', { ...user, kind: 'User' })
        : ability.can('delete', 'User'),
    canChangeEmail: () => ability.can('change-email', 'User'),
    canChangePassword: () => ability.can('change-password', 'User'),
    canExportUsers: () => ability.can('export-users', 'User'),
    canEnable2FA: () => ability.can('enable-2fa', 'User'),
  } as const;
}
