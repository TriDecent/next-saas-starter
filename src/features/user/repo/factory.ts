import { cache } from 'react';
import { PrismaUserRepository } from './PrismaUserRepository';

export const getUserRepo = cache(() => new PrismaUserRepository());
