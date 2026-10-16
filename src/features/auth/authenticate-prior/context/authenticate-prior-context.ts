'use client';

import { createContext } from 'react';
import { createStore } from 'zustand';

export type AuthenticatePriorState = AuthenticatePriorData & {
  action: AuthenticatePriorAction;
};

export type AuthenticatePriorData = {
  is2FAEnabled: boolean;
  doesSudoTokenExist: boolean;
  sudoTokenExpiresAt: number | null; // milliseconds since epoch

  enteredPassword?: string;
};

type AuthenticatePriorAction = {
  setEnteredPassword: (password: string) => void;
  syncData: (data: Partial<AuthenticatePriorData>) => void;
};

export function createAuthenticatePriorStore(
  state: Omit<AuthenticatePriorState, 'action'>
) {
  return createStore<AuthenticatePriorState>()(set => ({
    ...state,
    action: {
      setEnteredPassword: password => set({ enteredPassword: password }),
      syncData: data => set(data),
    },
  }));
}

type AuthenticatePriorStore = ReturnType<typeof createAuthenticatePriorStore>;

export const AuthenticatePriorContext =
  createContext<AuthenticatePriorStore | null>(null);
