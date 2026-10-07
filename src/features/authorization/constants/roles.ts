export const APP_ROLES = {
  'super-admin': 'super-admin',
  admin: 'admin',
  moderator: 'moderator',
  user: 'user',
} as const;

export type AppRole = keyof typeof APP_ROLES;

export const ORG_ROLES = {
  owner: 'owner',
  admin: 'admin',
  member: 'member',
  viewer: 'viewer',
} as const;

export type OrganizationRole = keyof typeof ORG_ROLES;
