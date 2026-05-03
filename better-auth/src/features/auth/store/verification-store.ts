import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type VerificationState = {
  verificationInfo?: {
    name: string;
    email: string;
  };
  actions: VerificationActions;
};

type VerificationActions = {
  setVerificationInfo: (info: VerificationState['verificationInfo']) => void;
  reset: () => void;
};

export const useVerificationStore = create<VerificationState>()(
  immer(set => ({
    verificationInfo: undefined,

    actions: {
      setVerificationInfo: verificationInfo => {
        set({ verificationInfo });
      },

      reset: () => {
        set({ verificationInfo: undefined });
      },
    },
  }))
);
