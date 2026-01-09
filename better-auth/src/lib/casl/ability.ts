import {
  AbilityBuilder,
  createMongoAbility,
  type InferSubjects,
  type MongoAbility,
} from '@casl/ability';
import { ROLES, type AuthSession } from '../auth';

type UserWithType = AuthSession['user'] & { kind: 'User' };
type UserSubject = InferSubjects<UserWithType>;
type Subjects = 'all' | UserSubject;
type CRUD = 'create' | 'read' | 'update' | 'delete';
type Actions = 'manage' | CRUD;
type AppAbility = MongoAbility<
  | [Actions, Subjects]
  | ['ban-user' | 'revoke-user' | 'impersonate-user', UserSubject]
>;

export function defineAbilityFor(actor: AuthSession['user']) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  const actorRoles = actor.role ? actor.role.split(',') : [];

  if (actorRoles.includes(ROLES.admin)) {
    defineAbilityForAdmin();
  } else if (actorRoles.includes(ROLES.moderator)) {
    defineAbilityForModerator();
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
}
