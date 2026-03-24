import { cache } from 'react';
import { InvitationRepository } from './invitation';
import { OrganizationRepository } from './organization';
import { SubscriptionRepository } from './subscription';
import { UserRepository } from './user';

export const getOrgRepo = cache(() => new OrganizationRepository());

export const getInvitationRepo = cache(() => new InvitationRepository());

export const getSubscriptionRepo = cache(() => new SubscriptionRepository());

export const getUserRepo = cache(() => new UserRepository());
