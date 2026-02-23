'use client';

import { use } from 'react';
import { AbilityContext } from './ability-context';

export function useAbility() {
  const context = use(AbilityContext);
  if (!context)
    throw new Error('useAbility must be used within an AbilityProvider');

  return context;
}
