'use client';

import type { ReactNode } from 'react';
import {
  AuthenticatePriorContext,
  type AuthenticatePriorContextType,
} from './authenticate-prior-context';

export function AuthenticatePriorProvider({
  value,
  children,
}: {
  value: AuthenticatePriorContextType;
  children: ReactNode;
}) {
  return (
    <AuthenticatePriorContext value={value}>
      {children}
    </AuthenticatePriorContext>
  );
}
