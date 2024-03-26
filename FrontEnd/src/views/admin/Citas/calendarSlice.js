import { createSlice } from '@reduxjs/toolkit';

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
