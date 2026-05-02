'use client';

import type { User } from '@/generated/prisma/client';
import { useState, type ReactNode } from 'react';
import { AbilityContext, createAbilityStore } from './ability-context';

export function AbilityProvider({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const [store] = useState(() => createAbilityStore(user));

  return <AbilityContext value={store}>{children}</AbilityContext>;
}
