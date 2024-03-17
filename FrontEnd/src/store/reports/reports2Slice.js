import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isReportsLoading: false,
  reports2: {},
  pageCount: 0,
};

const reports2Slice = createSlice({
  name: 'reports2',
  initialState,
  reducers: {
    setReports2(state, action) {
      state.reports2 = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedReports2(state, action) {
      state.isReportsLoading = false;
    },
    setLoadingReports2(state, action) {
      state.isReportsLoading = true;
    },
  },
});

export const { setReports2, setLoadedReports2, setLoadingReports2 } = reports2Slice.actions;
const reports2Reducer = reports2Slice.reducer;

export default reports2Reducer;
