import { getOrgPolicyFor } from './organization-subject-type';
import { getRolePolicyFor } from './role-subject-type';
import { getUserPolicyFor } from './user-subject-types';

export const AppPolicy = {
  getUserPolicyFor,
  getRolePolicyFor,
  getOrgPolicyFor,
} as const;
