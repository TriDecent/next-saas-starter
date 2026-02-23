import type { AbilityBuilder } from '@casl/ability';
import { createContext } from 'react';
import type { AppAbility } from '../../../lib/casl/ability';

export type AbilityUpdater = (
  can: AbilityBuilder<AppAbility>['can'],
  cannot: AbilityBuilder<AppAbility>['cannot']
) => void;

export type AbilityContextValue = Readonly<{
  ability: AppAbility;
  appendRules: (updater: AbilityUpdater) => void;
  resetRules: () => void;
}>;

export const AbilityContext = createContext<AbilityContextValue | null>(null);
