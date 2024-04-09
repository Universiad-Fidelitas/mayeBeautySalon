import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointmentServiceInformation: {},
  isAbleToNext: false,
  isEnd: false,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointmentServiceInformation(state, action) {
      state.appointmentServiceInformation = action.payload;
    },
    setIsAbleToNext(state, action) {
      state.isAbleToNext = action.payload;
    },
    setIsEnd(state, action) {
      state.isEnd = action.payload;
    },
  },
});

export const { setAppointmentServiceInformation, setIsAbleToNext, setIsEnd } = appointmentsSlice.actions;
const appointmentsReducer = appointmentsSlice.reducer;

export default appointmentsReducer;
