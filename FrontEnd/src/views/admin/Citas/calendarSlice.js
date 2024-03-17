import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL } from 'config.js';
import axios from 'axios';

const initialState = {
  selectedEvent: {},
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
  },
});

export const { setSelectedEvent } = calendarSlice.actions;

const calendarReducer = calendarSlice.reducer;

export default calendarReducer;
