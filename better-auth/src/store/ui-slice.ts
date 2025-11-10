// Temporarily not needed
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UIState = Readonly<{
  name: string | null;
  email: string | null;
}>;

const initialState: UIState = {
  name: null,
  email: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleEmailVerification: (state, action: PayloadAction<UIState>) => {
      state = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
