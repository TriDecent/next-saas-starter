import { createContext } from 'react';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type MultiStepState = {
  currentStep: number;
  actions: MultiStepActions;
};
type MultiStepActions = {
  next: () => void;
  back: () => void;
};

export function createMultiStepStore(stepCount: number) {
  const stepMax = Math.max(0, stepCount - 1);

  return createStore<MultiStepState>()(
    immer(set => ({
      currentStep: 0,
      actions: {
        next: () => {
          set(state => {
            if (state.currentStep >= stepMax) return;
            ++state.currentStep;
          });
        },
        back: () => {
          set(state => {
            if (state.currentStep <= 0) return;
            --state.currentStep;
          });
        },
      },
    }))
  );
}

export type MultiStepStore = ReturnType<typeof createMultiStepStore>;
export const MultiStepContext = createContext<MultiStepStore | null>(null);
