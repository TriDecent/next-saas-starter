import type { User } from '@/generated/prisma/client';
import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { APP_ROLES } from '../constants';
import type {
  InvitationAction,
  InvitationSubject,
} from './policies/global-invitation-policy';
import type {
  OrganizationAction,
  OrganizationSubject,
} from './policies/global-org-policy';
import type { RoleAction, RoleSubject } from './policies/global-role-policy';
import type { UserAction, UserSubject } from './policies/global-user-policy';

type Subject =
  | 'all'
  | UserSubject
  | RoleSubject
  | OrganizationSubject
  | InvitationSubject;
export type CRUD = 'create' | 'read' | 'update' | 'delete';
type Action = 'manage' | CRUD;
export type AppAbility = MongoAbility<
  | [Action, Subject]
  | [UserAction, UserSubject]
  | [RoleAction, RoleSubject]
  | [InvitationAction, InvitationSubject]
  | [OrganizationAction, OrganizationSubject]
>;

export function defineGlobalAbilityFor(actor: User) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  const actorRoles =
    actor.role
      ?.split(',')
      .map(role => role.trim())
      .filter(Boolean) ?? [];

  if (actorRoles.includes(APP_ROLES['super-admin']))
    defineAbilityForSuperAdmin();
  else if (actorRoles.includes(APP_ROLES.admin)) defineAbilityForAdmin();
  else if (actorRoles.includes(APP_ROLES.moderator))
    defineAbilityForModerator();
  else if (actorRoles.includes(APP_ROLES.user)) defineAbilityForUser();

  return build({ detectSubjectType: item => item.kind });

  function defineAbilityForSuperAdmin() {
    can('manage', 'all');
  }

  function defineAbilityForAdmin() {
    can('manage', 'all');
    cannotManageUsers(
      ['ban-user', 'revoke-user', 'delete', 'impersonate-user', 'set-role'],
      protectedAdminRoles,
      'Admins cannot manage other admins or super-admins'
    );
    cannotManageActor(
      ['revoke-user', 'delete', 'impersonate-user', 'set-role'],
      'Admins cannot manage their own account'
    );

    cannot('assign', 'Role', {
      name: { $in: [APP_ROLES['super-admin'], APP_ROLES['admin']] },
    }).because('Admins cannot assign super-admin or admin roles');

    if (!PROTECTED_EMAILS.includes(actor.email)) return;
    defineExclusiveAbilityForProtectedEmails();
  }

  function defineAbilityForModerator() {
    can('get-user', 'User');
    can('list-user', 'User');
    can('create', 'Organization');
    can('create', 'Invitation');

    can('ban-user', 'User');
    cannotManageUsers(
      ['ban-user'],
      protectedModeratorRoles,
      'Moderators cannot ban other moderators, admins, or super-admins'
    );

    can('read', 'User', { id: actor.id });

    can('change-email', 'User');
    can('change-password', 'User');
    can('enable-2fa', 'User');

    if (!PROTECTED_EMAILS.includes(actor.email)) return;
    defineExclusiveAbilityForProtectedEmails();
  }

  function defineAbilityForUser() {
    can('get-user', 'User');

    can('read', 'User', { id: actor.id });

    can('change-email', 'User');
    can('change-password', 'User');
    can('enable-2fa', 'User');

    if (!PROTECTED_EMAILS.includes(actor.email)) return;
    defineExclusiveAbilityForProtectedEmails();
  }

  function defineExclusiveAbilityForProtectedEmails() {
    cannot('change-email', 'User').because(
      'Users with protected emails cannot change their email'
    );
    cannot('change-password', 'User').because(
      'Users with protected emails cannot change their password'
    );
    cannot('enable-2fa', 'User').because(
      'Users with protected emails cannot enable 2FA'
    );
    cannot('set-role', 'User', { email: { $in: PROTECTED_EMAILS } }).because(
      'Users with protected emails cannot set role for other protected users'
    );
    cannot('ban-user', 'User', { email: { $in: PROTECTED_EMAILS } }).because(
      'Users with protected emails cannot ban other protected users'
    );
  }

  type UserManagementAction = UserAction | 'delete';

  function cannotManageUsers(
    actions: UserManagementAction[],
    roles: string[],
    message: string
  ) {
    for (const action of actions) {
      cannot(action, 'User', {
        role: { $regex: roleRegex(roles) },
      }).because(message);
    }
  }

  function cannotManageActor(actions: UserManagementAction[], message: string) {
    for (const action of actions)
      cannot(action, 'User', { id: actor.id }).because(message);
  }
}

const protectedAdminRoles = [APP_ROLES['super-admin'], APP_ROLES.admin];
const protectedModeratorRoles = [...protectedAdminRoles, APP_ROLES.moderator];
const PROTECTED_EMAILS = ['sandbox-admin@gmail.com', 'sandbox-user@gmail.com'];

const roleRegex = (roles: string[]) =>
  new RegExp(`(^|,)\\s*(${roles.join('|')})\\s*(,|$)`);
