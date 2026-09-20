import type { auth } from './auth';
import type { APP_ROLES, ORG_ROLES } from './constants';

export type AppRole = keyof typeof APP_ROLES;
export type UserRole = AppRole;
export type OrganizationRole = keyof typeof ORG_ROLES;

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;
