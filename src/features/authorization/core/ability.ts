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
      role: { $regex: `^(${APP_ROLES['super-admin']}|${APP_ROLES.admin})$` },
    });

    cannot('revoke-user', 'User', { id: actor.id });
    cannot('revoke-user', 'User', {
      role: { $regex: `^(${APP_ROLES['super-admin']}|${APP_ROLES.admin})$` },
    });

    cannot('delete', 'User', { id: actor.id });
    cannot('delete', 'User', {
      role: { $regex: `^(${APP_ROLES['super-admin']}|${APP_ROLES.admin})$` },
    });

    cannot('impersonate-user', 'User', { id: actor.id });
    cannot('impersonate-user', 'User', {
      role: { $regex: `^(${APP_ROLES['super-admin']}|${APP_ROLES.admin})$` },
    });

    cannot('set-role', 'User', { id: actor.id });
    cannot('set-role', 'User', {
      role: { $regex: `^(${APP_ROLES['super-admin']}|${APP_ROLES.admin})$` },
    });

    cannot('assign', 'Role', {
      name: { $in: [APP_ROLES['super-admin'], APP_ROLES['admin']] },
    });

    if (!PROTECTED_EMAILS.includes(actor.email)) return;
    defineExclusiveAbilityForProtectedEmails();
  }

  function defineAbilityForModerator() {
    can('ban-user', 'User');
    cannot('ban-user', 'User', {
      role: {
        $regex: `^(${APP_ROLES['super-admin']}|${APP_ROLES.admin}|${APP_ROLES.moderator})$`,
      },
    });

    can('read', 'User', { id: actor.id });

    can('change-email', 'User');
    can('change-password', 'User');
    can('enable-2fa', 'User');

    if (!PROTECTED_EMAILS.includes(actor.email)) return;
    defineExclusiveAbilityForProtectedEmails();
  }

  function defineAbilityForUser() {
    can('read', 'User', { id: actor.id });

    can('change-email', 'User');
    can('change-password', 'User');
    can('enable-2fa', 'User');

    if (!PROTECTED_EMAILS.includes(actor.email)) return;
    defineExclusiveAbilityForProtectedEmails();
  }

  function defineExclusiveAbilityForProtectedEmails() {
    cannot('change-email', 'User');
    cannot('change-password', 'User');
    cannot('enable-2fa', 'User');
    cannot('set-role', 'User', { email: { $in: PROTECTED_EMAILS } });
    cannot('ban-user', 'User', { email: { $in: PROTECTED_EMAILS } });
  }
}

const PROTECTED_EMAILS = ['sandbox-admin@gmail.com', 'sandbox-user@gmail.com'];
