import { cache } from 'react';
import { InvitationRepository } from './invitation';
import { OrganizationRepository } from './organization';
import { SubscriptionRepository } from './subscription';

export const getOrgRepo = cache(() => new OrganizationRepository());

export const getInvitationRepo = cache(() => new InvitationRepository());

export const getSubscriptionRepo = cache(() => new SubscriptionRepository());
