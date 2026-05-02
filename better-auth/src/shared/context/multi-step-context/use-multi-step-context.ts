'use client';

import { use } from 'react';
import { useStore } from 'zustand';
import { MultiStepContext, type MultiStepState } from './multi-step-context';

export function useMultiStepContext<T>(
  selector: (state: MultiStepState) => T
): T {
  const ctx = use(MultiStepContext);
  if (!ctx)
    throw new Error(
      'useMultiStepStore must be used within a MultiStepProvider'
    );

  return useStore(ctx, selector);
}
