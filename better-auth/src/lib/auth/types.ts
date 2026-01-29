import type { auth } from './auth';
import { ROLES } from './permissions';

export type AppRoles = keyof typeof ROLES;

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;
