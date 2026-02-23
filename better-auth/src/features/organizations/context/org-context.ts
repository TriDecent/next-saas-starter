'use client';

import type { Organization } from 'better-auth/plugins';
import { createContext } from 'react';

export type OrgContextValue = Organization;

export const OrgContext = createContext<OrgContextValue | null>(null);
