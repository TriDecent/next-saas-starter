import type { User } from '@/generated/prisma/client';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { createContext } from 'react';
import { createStore } from 'zustand';
import { defineAbilityFor, type AppAbility } from '../../../lib/casl/ability';

type AbilityUpdater = (
  can: AbilityBuilder<AppAbility>['can'],
  cannot: AbilityBuilder<AppAbility>['cannot']
) => void;

export type AbilityState = Readonly<{
  ability: AppAbility;
  actions: {
    appendRules: (updater: AbilityUpdater) => void;
    resetRules: () => void;
  };
}>;

export function createAbilityStore(initialUser: User) {
  const initialAbility = defineAbilityFor(initialUser);

  return createStore<AbilityState>()((set, get) => ({
    ability: initialAbility,
    actions: {
      appendRules: (updater: AbilityUpdater) => {
        const currentAbility = get().ability;

        const {
          can,
          cannot,
          rules: newRules,
        } = new AbilityBuilder<AppAbility>(createMongoAbility);

        updater(can, cannot);

        const combinedRules = [...currentAbility.rules, ...newRules];

        set({ ability: createMongoAbility<AppAbility>(combinedRules) });
      },
      resetRules: () => {
        set({ ability: defineAbilityFor(initialUser) });
      },
    },
  }));
}

type AbilityStore = ReturnType<typeof createAbilityStore>;
export const AbilityContext = createContext<AbilityStore | null>(null);
