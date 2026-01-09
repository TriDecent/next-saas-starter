'use client';

import { type ReactNode } from 'react';
import {
  AuthenticatePriorContext,
  type AuthenticatePriorContextType,
} from './authenticate-prior-context';
import { SudoTokenExpiryHandler } from './SudoTokenExpiryHandler';

export function AuthenticatePriorClientProvider({
  value,
  children,
}: {
  value: AuthenticatePriorContextType;
  children: ReactNode;
}) {
  return (
    <AuthenticatePriorContext value={value}>
      <SudoTokenExpiryHandler value={value} />
      {children}
    </AuthenticatePriorContext>
  );
}
