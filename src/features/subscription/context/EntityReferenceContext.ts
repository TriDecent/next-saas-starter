'use client';

import { createContext } from 'react';

export type EntityReferenceContextType = {
  referenceId: string | undefined;
};

export const EntityReferenceContext = createContext<EntityReferenceContextType>(
  {
    referenceId: undefined,
  }
);
