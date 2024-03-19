import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isServicesLoading: false,
  services: {},
  pageCount: 0,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices(state, action) {
      state.services = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedServices(state, action) {
      state.isServicesLoading = false;
    },
    setLoadingServices(state, action) {
      state.isServicesLoading = true;
    },
  },
});

export const { setServices, setLoadedServices, setLoadingServices } = servicesSlice.actions;
const servicesReducer = servicesSlice.reducer;

export default servicesReducer;
