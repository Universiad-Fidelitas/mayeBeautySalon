import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogsLoading: false,
  logs: {},
  pageCount: 0,
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogs(state, action) {
      state.logs = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedLogs(state) {
      state.isLogsLoading = false;
    },
    setLoadingLogs(state) {
      state.isLogsLoading = true;
    },
  },
});

export const { setLogs, setLoadedLogs, setLoadingLogs } = logsSlice.actions;
const logsReducer = logsSlice.reducer;

export default logsReducer;
