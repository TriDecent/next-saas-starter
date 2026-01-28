import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { ROLES, type AuthSession } from '../auth';
import type { RoleActionsType, RoleSubject } from './role-subject-type';
import type { UserActionTypes, UserSubject } from './user-subject-types';

type Subjects = 'all' | UserSubject | RoleSubject;
export type CRUD = 'create' | 'read' | 'update' | 'delete';
type Actions = 'manage' | CRUD;
export type AppAbility = MongoAbility<
  | [Actions, Subjects]
  | [UserActionTypes, UserSubject]
  | [RoleActionsType, RoleSubject]
>;

export function defineAbilityFor(actor: AuthSession['user']) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  const actorRoles = actor.role?.split(',') ?? [];

  if (actorRoles.includes(ROLES['super-admin'])) defineAbilityForSuperAdmin();
  else if (actorRoles.includes(ROLES.admin)) defineAbilityForAdmin();
  else if (actorRoles.includes(ROLES.moderator)) defineAbilityForModerator();
  else if (actorRoles.includes(ROLES.user)) defineAbilityForUser();

  return build({ detectSubjectType: item => item.kind });

  function defineAbilityForSuperAdmin() {
    can('manage', 'all');
  }

  function defineAbilityForAdmin() {
    can('manage', 'all');
    cannot('ban-user', 'User', {
      role: { $regex: `^(${ROLES['super-admin']}|${ROLES.admin})$` },
    });

    cannot('revoke-user', 'User', { id: actor.id });
    cannot('revoke-user', 'User', {
      role: { $regex: `^(${ROLES['super-admin']}|${ROLES.admin})$` },
    });

    cannot('delete', 'User', { id: actor.id });
    cannot('delete', 'User', {
      role: { $regex: `^(${ROLES['super-admin']}|${ROLES.admin})$` },
    });

    cannot('impersonate-user', 'User', { id: actor.id });
    cannot('impersonate-user', 'User', {
      role: { $regex: `^(${ROLES['super-admin']}|${ROLES.admin})$` },
    });

    cannot('set-role', 'User', { id: actor.id });
    cannot('set-role', 'User', {
      role: { $regex: `^(${ROLES['super-admin']}|${ROLES.admin})$` },
    });

    cannot('assign', 'Role', {
      name: { $in: [ROLES['super-admin'], ROLES['admin']] },
    });
  }

  function defineAbilityForModerator() {
    can('ban-user', 'User');
    cannot('ban-user', 'User', {
      role: { $regex: `^(${ROLES.admin}|${ROLES.moderator})$` },
    });
  }

  function defineAbilityForUser() {}
}
