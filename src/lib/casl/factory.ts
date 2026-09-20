import { getInvitationPolicyFor } from './invitation-policy';
import { getOrgPolicyFor } from './org-policy';
import { getRolePolicyFor } from './role-policy';
import { getSubscriptionPolicyFor } from './subscription-policy';
import { getUserPolicyFor } from './user-policy';

export const AppPolicy = {
  getUserPolicyFor,
  getRolePolicyFor,
  getOrgPolicyFor,
  getInvitationPolicyFor,
  getSubscriptionPolicyFor,
} as const;
