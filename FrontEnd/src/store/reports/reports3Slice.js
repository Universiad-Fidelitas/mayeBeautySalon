import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isReportsLoading: false,
  reports3: {},
  pageCount: 0,
};

const reports3Slice = createSlice({
  name: 'reports3',
  initialState,
  reducers: {
    setReports3(state, action) {
      state.reports3 = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedReports3(state) {
      state.isReportsLoading = false;
    },
    setLoadingReports3(state) {
      state.isReportsLoading = true;
    },
  },
});

export const { setReports3, setLoadedReports3, setLoadingReports3 } = reports3Slice.actions;
const reports3Reducer = reports3Slice.reducer;

export default reports3Reducer;
