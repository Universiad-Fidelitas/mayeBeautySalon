import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVICE_URL } from 'config.js';
import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';

const initialState = {
  status: 'idle',
  items: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationsLoading(state) {
      state.status = 'loading';
    },
    notificationsLoaded(state, action) {
      state.items = action.payload;
      state.status = 'idle';
    },
  },
});

export const { notificationsLoading, notificationsLoaded } = notificationSlice.actions;

export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch(notificationsLoading());

    const { data } = await baseApi.post('/notifications');
    if (data) {
      dispatch(notificationsLoaded(data));
    }
  } catch (error) {
    // dispatch(setLoadedNotifications());
  }
};

const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
