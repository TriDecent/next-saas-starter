'use client';

import type { User } from '@/generated/prisma/client';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { useCallback, useState, type ReactNode } from 'react';
import { AppAbility, defineAbilityFor } from '../../../lib/casl/ability';
import { AbilityContext, type AbilityUpdater } from './ability-context';

export function AbilityProvider({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const [ability, setAbility] = useState<AppAbility>(() =>
    defineAbilityFor(user)
  );

  const appendRules = useCallback(
    (updater: AbilityUpdater) =>
      setAbility(currentAbility => {
        const {
          can,
          cannot,
          rules: newRules,
        } = new AbilityBuilder<AppAbility>(createMongoAbility);

        updater(can, cannot);

        const combinedRules = [...currentAbility.rules, ...newRules];

        return createMongoAbility(combinedRules);
      }),
    []
  );

  const resetRules = useCallback(
    () => setAbility(defineAbilityFor(user)),
    [user]
  );

  return (
    <AbilityContext value={{ ability, appendRules, resetRules }}>
      {children}
    </AbilityContext>
  );
}
