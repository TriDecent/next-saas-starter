'use client';

import { createContext } from 'react';

export type AuthenticatePriorContextType = {
  is2FAEnabled: boolean;
  doesSudoTokenExist: boolean;
  sudoTokenExpiresAt: number | null; // milliseconds since epoch
};

export const AuthenticatePriorContext =
  createContext<AuthenticatePriorContextType | null>(null);
