import { getInvitationPolicyFor } from './policies/invitation-policy';
import { getOrgPolicyFor } from './policies/org-policy';
import { getRolePolicyFor } from './policies/role-policy';
import { getSubscriptionPolicyFor } from './policies/subscription-policy';
import { getUserPolicyFor } from './policies/user-policy';

export const AppPolicy = {
  getUserPolicyFor,
  getRolePolicyFor,
  getOrgPolicyFor,
  getInvitationPolicyFor,
  getSubscriptionPolicyFor,
} as const;
