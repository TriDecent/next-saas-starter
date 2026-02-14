'use client';

import { createContext } from 'react';

export type OrgContextValue = { slug: string };

export const OrgContext = createContext<OrgContextValue | null>(null);
