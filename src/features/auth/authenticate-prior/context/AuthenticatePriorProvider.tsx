'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { SudoTokenExpiryHandler } from '../SudoTokenExpiryHandler';
import {
  AuthenticatePriorContext,
  createAuthenticatePriorStore,
  type AuthenticatePriorData,
} from './authenticate-prior-context';
import { useAuthenticatePrior } from './use-authenticate-prior';

export function AuthenticatePriorProvider({
  value,
  children,
}: {
  value: AuthenticatePriorData;
  children: ReactNode;
}) {
  const [store] = useState(() => createAuthenticatePriorStore(value));

  return (
    <AuthenticatePriorContext value={store}>
      <SyncDataContext data={value} />
      <SudoTokenExpiryHandler />
      {children}
    </AuthenticatePriorContext>
  );
}

function SyncDataContext({ data }: { data: AuthenticatePriorData }) {
  const syncData = useAuthenticatePrior(state => state.action.syncData);

  useEffect(() => {
    syncData(data);
  }, [data, syncData]);

  return null;
}
