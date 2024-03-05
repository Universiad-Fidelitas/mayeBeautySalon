import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAppointments: {}
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setServiceDateTime(state, action) {
      state.selectedAppointments = action.payload
    },
  },
});

export const { setServiceDateTime } = appointmentsSlice.actions;
const appointmentsReducer = appointmentsSlice.reducer;

export default appointmentsReducer;
