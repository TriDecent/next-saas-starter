import type { auth } from './auth';
import { ROLES } from './constants';

export type AppRole = keyof typeof ROLES;
export type UserRole = Extract<
  AppRole,
  'super-admin' | 'admin' | 'user' | 'moderator'
>;
export type OrganizationRole = Extract<
  AppRole,
  'super-admin' | 'admin' | 'owner' | 'member'
>;
export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;
