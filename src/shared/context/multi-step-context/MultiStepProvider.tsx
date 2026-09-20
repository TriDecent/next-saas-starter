'use client';

import type React from 'react';
import { useState } from 'react';
import { createMultiStepStore, MultiStepContext } from './multi-step-context';

export function MultiStepProvider({
  children,
  stepCount,
}: {
  children: React.ReactNode;
  stepCount: number;
}) {
  const [store] = useState(() => createMultiStepStore(stepCount));

  return <MultiStepContext value={store}>{children}</MultiStepContext>;
}
