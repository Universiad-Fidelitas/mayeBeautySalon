import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBills: {},
  custumerInfo: {},
};

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills(state, action) {
      state.selectedBills = action.payload;
    },
    setCustumerInfo(state, action) {
      state.custumerInfo = action.payload;
    },
  },
});

export const { setBills, setCustumerInfo } = billsSlice.actions;
const billsReducer = billsSlice.reducer;

export default billsReducer;
