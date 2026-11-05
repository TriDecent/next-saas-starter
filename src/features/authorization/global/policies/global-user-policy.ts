import type { User } from '@/generated/prisma/client';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import type { AuthSession } from '../../../../lib/auth';
import { defineGlobalAbilityFor } from '../global-ability';

type BaseUser = AuthSession['user'];
type UserWithType = BaseUser & { kind: 'User' };
export type UserSubject = InferSubjects<UserWithType>;
export type UserAction =
  | 'ban-user'
  | 'revoke-user'
  | 'impersonate-user'
  | 'set-role'
  | 'change-email'
  | 'change-password'
  | 'export-users'
  | 'enable-2fa'
  | 'get-user'
  | 'list-user'
  | 'delete-user';

export function getGlobalUserPolicyFor(actor: User) {
  const ability = defineGlobalAbilityFor(actor);

  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanRead: (user?: BaseUser) =>
      user
        ? forbiddenError.throwUnlessCan('read', { ...user, kind: 'User' })
        : forbiddenError.throwUnlessCan('read', 'User'),

    assertCanBan: (user?: BaseUser) =>
      user
        ? forbiddenError.throwUnlessCan('ban-user', { ...user, kind: 'User' })
        : forbiddenError.throwUnlessCan('ban-user', 'User'),

    assertCanRevoke: (user?: BaseUser) =>
      user
        ? forbiddenError.throwUnlessCan('revoke-user', {
            ...user,
            kind: 'User',
          })
        : forbiddenError.throwUnlessCan('revoke-user', 'User'),

    assertCanImpersonate: (user?: BaseUser) =>
      user
        ? forbiddenError.throwUnlessCan('impersonate-user', {
            ...user,
            kind: 'User',
          })
        : forbiddenError.throwUnlessCan('impersonate-user', 'User'),

    assertCanSetRole: (user?: BaseUser) =>
      user
        ? forbiddenError.throwUnlessCan('set-role', { ...user, kind: 'User' })
        : forbiddenError.throwUnlessCan('set-role', 'User'),

    assertCanDelete: (user?: BaseUser) =>
      user
        ? forbiddenError.throwUnlessCan('delete', { ...user, kind: 'User' })
        : forbiddenError.throwUnlessCan('delete', 'User'),

    assertCanChangeEmail: () =>
      forbiddenError.throwUnlessCan('change-email', 'User'),
    assertCanChangePassword: () =>
      forbiddenError.throwUnlessCan('change-password', 'User'),
    assertCanExportUsers: () =>
      forbiddenError.throwUnlessCan('export-users', 'User'),
    assertCanEnable2FA: () =>
      forbiddenError.throwUnlessCan('enable-2fa', 'User'),

    assertCanGetUser: () =>
      forbiddenError
        .setMessage('You are not allowed to get user information.')
        .throwUnlessCan('get-user', 'User'),
    assertCanList: () =>
      forbiddenError
        .setMessage('You are not allowed to list users.')
        .throwUnlessCan('list-user', 'User'),
  } as const;
}
