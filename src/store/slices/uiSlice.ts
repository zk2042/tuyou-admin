import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  siderCollapsed: boolean;
  noticeUnread: number;
}

const initialState: UiState = {
  siderCollapsed: false,
  noticeUnread: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSiderCollapsed(state, action: PayloadAction<boolean>) {
      state.siderCollapsed = action.payload;
    },
    setNoticeUnread(state, action: PayloadAction<number>) {
      state.noticeUnread = action.payload;
    },
  },
});

export const { setNoticeUnread, setSiderCollapsed } = uiSlice.actions;
export default uiSlice.reducer;
