import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isReportsLoading: false,
  reports: {},
  pageCount: 0,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports(state, action) {
      state.reports = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedReports(state, action) {
      state.isReportsLoading = false;
    },
    setLoadingReports(state, action) {
      state.isReportsLoading = true;
    },
  },
});

export const { setReports, setLoadedReports, setLoadingReports } = reportsSlice.actions;
const reportsReducer = reportsSlice.reducer;

export default reportsReducer;
