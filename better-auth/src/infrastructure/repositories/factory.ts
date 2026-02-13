import { cache } from 'react';
import { OrganizationRepository } from './organization';

export const getOrgRepo = cache(() => new OrganizationRepository());
