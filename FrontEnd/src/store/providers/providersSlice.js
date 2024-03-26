import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isProvidersLoading: false,
  providers: {},
  pageCount: 0,
};

const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders(state, action) {
      state.providers = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedProviders(state) {
      state.isProvidersLoading = false;
    },
    setLoadingProviders(state) {
      state.isProvidersLoading = true;
    },
  },
});

export const { setProviders, setLoadedProviders, setLoadingProviders } = providersSlice.actions;
const providersReducer = providersSlice.reducer;

export default providersReducer;
