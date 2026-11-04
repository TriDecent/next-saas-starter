import { type AuthSession } from '@/lib/auth';
import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { APP_ROLES } from '../constants';
import type {
  InvitationAction,
  InvitationSubject,
} from './policies/invitation-policy';
import type {
  OrganizationAction,
  OrganizationSubject,
} from './policies/org-policy';
import type { RoleAction, RoleSubject } from './policies/role-policy';
import type {
  SubscriptionAction,
  SubscriptionSubject,
} from './policies/subscription-policy';
import type { UserAction, UserSubject } from './policies/user-policy';

type Subject =
  | 'all'
  | UserSubject
  | RoleSubject
  | OrganizationSubject
  | InvitationSubject
  | SubscriptionSubject;
export type CRUD = 'create' | 'read' | 'update' | 'delete';
type Action = 'manage' | CRUD;
export type AppAbility = MongoAbility<
  | [Action, Subject]
  | [UserAction, UserSubject]
  | [RoleAction, RoleSubject]
  | [InvitationAction, InvitationSubject]
  | [OrganizationAction, OrganizationSubject]
  | [SubscriptionAction, SubscriptionSubject]
>;

export function defineAbilityFor(actor: AuthSession['user']) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  const actorRoles = actor.role?.split(',') ?? [];

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
    cannot('ban-user', 'User', {
      role: { $regex: protectedAdminRoles },
    }).because('Admins cannot ban other admins or super-admins');

    cannot('revoke-user', 'User', { id: actor.id }).because(
      'Admins cannot revoke their own account'
    );
    cannot('revoke-user', 'User', {
      role: { $regex: protectedAdminRoles },
    }).because('Admins cannot revoke other admins or super-admins');

    cannot('delete', 'User', { id: actor.id }).because(
      'Admins cannot delete their own account'
    );
    cannot('delete', 'User', {
      role: { $regex: protectedAdminRoles },
    }).because('Admins cannot delete other admins or super-admins');

    cannot('impersonate-user', 'User', { id: actor.id }).because(
      'Admins cannot impersonate themselves'
    );
    cannot('impersonate-user', 'User', {
      role: { $regex: protectedAdminRoles },
    }).because('Admins cannot impersonate other admins or super-admins');

    cannot('set-role', 'User', { id: actor.id }).because(
      'Admins cannot change their own role'
    );
    cannot('set-role', 'User', {
      role: { $regex: protectedAdminRoles },
    }).because('Admins cannot change the role of other admins or super-admins');

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
    cannot('ban-user', 'User', {
      role: { $regex: protectedModeratorRoles },
    }).because(
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
}

const protectedAdminRoles = new RegExp(
  `(^|,)\\s*(${APP_ROLES['super-admin']}|${APP_ROLES.admin})\\s*(,|$)`
);
const protectedModeratorRoles = new RegExp(
  `(^|,)\\s*(${APP_ROLES['super-admin']}|${APP_ROLES.admin}|${APP_ROLES.moderator})\\s*(,|$)`
);
const PROTECTED_EMAILS = ['sandbox-admin@gmail.com', 'sandbox-user@gmail.com'];
