import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  siderCollapsed: boolean;
}

const initialState: UiState = {
  siderCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSiderCollapsed(state, action: PayloadAction<boolean>) {
      state.siderCollapsed = action.payload;
    },
  },
});

export const { setSiderCollapsed } = uiSlice.actions;
export default uiSlice.reducer;
