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
type Actions = 'manage';
type AppAbility = MongoAbility<[Actions, Subjects] | ['ban-user', UserSubject]>;

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
  }

  function defineAbilityForModerator() {
    can('ban-user', 'User');
    cannot('ban-user', 'User', {
      role: { $regex: `^(${ROLES.admin}|${ROLES.moderator})$` },
    });
  }
}
