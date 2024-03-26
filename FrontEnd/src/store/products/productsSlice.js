import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isProductsLoading: false,
  products: {},
  pageCount: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedProducts(state) {
      state.isProductsLoading = false;
    },
    setLoadingProducts(state) {
      state.isProductsLoading = true;
    },
  },
});

export const { setProducts, setLoadedProducts, setLoadingProducts } = productsSlice.actions;
const productsReducer = productsSlice.reducer;

export default productsReducer;
