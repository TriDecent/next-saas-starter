import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { ROLES, type AuthSession } from '../auth';
import type { UserActionTypes, UserSubject } from './user-subject-types';

type Subjects = 'all' | UserSubject;
export type CRUD = 'create' | 'read' | 'update' | 'delete';
type Actions = 'manage' | CRUD;
type AppAbility = MongoAbility<
  [Actions, Subjects] | [UserActionTypes, UserSubject]
>;

export function defineAbilityFor(actor: AuthSession['user']) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  const actorRoles = actor.role?.split(',') ?? [];

  if (actorRoles.includes(ROLES.admin)) {
    defineAbilityForAdmin();
  } else if (actorRoles.includes(ROLES.moderator)) {
    defineAbilityForModerator();
  } else if (actorRoles.includes(ROLES.user)) {
    defineAbilityForUser();
  }

  return build({ detectSubjectType: item => item.kind });

  function defineAbilityForAdmin() {
    can('manage', 'all');
    cannot('ban-user', 'User', { role: { $regex: ROLES.admin } });

    can('revoke-user', 'User');
    cannot('revoke-user', 'User', { role: { $regex: ROLES.admin } });

    can('delete', 'User', { id: { $ne: actor.id } });
    cannot('delete', 'User', { role: { $regex: ROLES.admin } });

    can('impersonate-user', 'User');
    cannot('impersonate-user', 'User', { role: { $regex: ROLES.admin } });
  }

  function defineAbilityForModerator() {
    can('ban-user', 'User');
    cannot('ban-user', 'User', {
      role: { $regex: `^(${ROLES.admin}|${ROLES.moderator})$` },
    });
  }

  function defineAbilityForUser() {}
}
