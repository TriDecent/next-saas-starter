'use client';

import { use } from 'react';
import { OrgContext } from './org-context';

export function useOrgContext() {
  const context = use(OrgContext);
  if (!context)
    throw new Error('useOrgContext must be used within an OrgContextProvider');

  return context;
}
