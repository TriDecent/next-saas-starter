'use client';

import { use } from 'react';
import { useStore } from 'zustand';
import {
  AuthenticatePriorContext,
  type AuthenticatePriorState,
} from './authenticate-prior-context';

export function useAuthenticatePrior<T>(
  selector: (state: AuthenticatePriorState) => T
): T {
  const ctx = use(AuthenticatePriorContext);
  if (!ctx)
    throw new Error(
      'useAuthenticatePrior must be used within an AuthenticatePriorClientProvider'
    );

  return useStore(ctx, selector);
}
