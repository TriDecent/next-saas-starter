import { getGlobalInvPolicyFor } from './policies/global-invitation-policy';
import { getGlobalOrgPolicyFor } from './policies/global-org-policy';
import { getGlobalRolePolicyFor } from './policies/global-role-policy';
import { getGlobalUserPolicyFor } from './policies/global-user-policy';

export const AppPolicy = {
  getUserPolicyFor: getGlobalUserPolicyFor,
  getRolePolicyFor: getGlobalRolePolicyFor,
  getOrgPolicyFor: getGlobalOrgPolicyFor,
  getInvitationPolicyFor: getGlobalInvPolicyFor,
} as const;
