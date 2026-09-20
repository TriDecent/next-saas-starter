'use client';

import { use } from 'react';
import { useStore } from 'zustand';
import { AbilityContext, type AbilityState } from './ability-context';

export function useAbility<T>(selector: (state: AbilityState) => T): T {
  const context = use(AbilityContext);
  if (!context)
    throw new Error('useAbility must be used within an AbilityProvider');

  return useStore(context, selector);
}
