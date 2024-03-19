import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isProductsLoading: false,
  products: {},
  pageCount: 0,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments(state, action) {
      state.products = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedPayments(state, action) {
      state.isProductsLoading = false;
    },
    setLoadingPayments(state, action) {
      state.isProductsLoading = true;
    },
  },
});

export const { setPayments, setLoadedPayments, setLoadingPayments } = paymentsSlice.actions;
const paymentsReducer = paymentsSlice.reducer;

export default paymentsReducer;
