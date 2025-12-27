'use client';

import { createContext } from 'react';

export type AuthenticatePriorContextType = {
  is2FAEnabled: boolean;
  doesSudoTokenExist: boolean;
};

export const AuthenticatePriorContext =
  createContext<AuthenticatePriorContextType | null>(null);
