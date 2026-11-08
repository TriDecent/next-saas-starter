import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { ORG_ROLES } from '../constants';
import type { SubscriptionAbilityTuple } from './policies/org-subscription-policy';
import type { OrgUserContext } from './types';

type Subject = 'all';
type Action = 'manage';

type OrgAbility = MongoAbility<[Action, Subject] | SubscriptionAbilityTuple>;

export function defineOrgAbilityFor(ctx: OrgUserContext) {
  const { can, build } = new AbilityBuilder<OrgAbility>(createMongoAbility);

  const actorMemberRoles =
    ctx.member.role
      ?.split(',')
      .map(role => role.trim())
      .filter(Boolean) ?? [];

  if (actorMemberRoles.includes(ORG_ROLES.owner)) defineAbilityForOwner();
  else if (actorMemberRoles.includes(ORG_ROLES.admin)) defineAbilityForAdmin();
  else if (actorMemberRoles.includes(ORG_ROLES.member))
    defineAbilityForMember();
  else if (actorMemberRoles.includes(ORG_ROLES.viewer))
    defineAbilityForViewer();

  return build({ detectSubjectType: subject => subject.kind });

  function defineAbilityForOwner() {
    can('manage', 'all');
  }
  function defineAbilityForAdmin() {
    defineSubscriptionAbility([
      'billing-portal',
      'upgrade-subscription',
      'list-subscription',
    ]);
  }
  function defineAbilityForMember() {
    defineSubscriptionAbility(['billing-portal', 'list-subscription']);
  }
  function defineAbilityForViewer() {
    defineSubscriptionAbility(['list-subscription']);
  }

  function defineSubscriptionAbility<T extends SubscriptionAbilityTuple[0]>(
    actions: Iterable<T>
  ) {
    for (const action of actions) {
      can(action, 'Subscription');
    }
  }
}
