import { cache } from 'react';
import { PrismaOrgRepository } from './OrganizationRepository';

export const getOrgRepo = cache(() => new PrismaOrgRepository());
