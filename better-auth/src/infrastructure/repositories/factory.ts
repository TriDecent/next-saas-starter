import { cache } from 'react';
import { InvitationRepository } from './invitation';
import { OrganizationRepository } from './organization';

export const getOrgRepo = cache(() => new OrganizationRepository());

export const getInvitationRepo = cache(() => new InvitationRepository());
