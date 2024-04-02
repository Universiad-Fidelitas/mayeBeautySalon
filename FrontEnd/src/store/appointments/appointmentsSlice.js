import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAppointments: {},
  custumerInfo: {},
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setServiceDateTime(state, action) {
      state.selectedAppointments = action.payload;
    },
    setCustumerInfo(state, action) {
      state.custumerInfo = action.payload;
    },
  },
});

export const { setServiceDateTime, setCustumerInfo } = appointmentsSlice.actions;
const appointmentsReducer = appointmentsSlice.reducer;

export default appointmentsReducer;
