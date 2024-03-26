import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNotificationsLoading: false,
  notifications: {},
  pageCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedNotifications(state) {
      state.isNotificationsLoading = false;
    },
    setLoadingNotifications(state) {
      state.isNotificationsLoading = true;
    },
  },
});

export const { setNotifications, setLoadedNotifications, setLoadingNotifications } = notificationsSlice.actions;
const notificationsReducer = notificationsSlice.reducer;

export default notificationsReducer;
