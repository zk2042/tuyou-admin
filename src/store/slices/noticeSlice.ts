import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface NoticeState {
  unreadCount: number;
}

const initialState: NoticeState = {
  unreadCount: 0,
};

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
  },
});

export const { setUnreadCount } = noticeSlice.actions;
export default noticeSlice.reducer;
