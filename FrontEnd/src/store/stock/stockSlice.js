import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isStockLoading: false,
  stock: {},
  pageCount: 0,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock(state, action) {
      state.stock = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedStock(state, action) {
      state.isStockLoading = false;
    },
    setLoadingStock(state, action) {
      state.isStockLoading = true;
    },
  },
});
console.log('prueba loading', stockSlice);
export const { setStock, setLoadedStock, setLoadingStock } = stockSlice.actions;
const stockReducer = stockSlice.reducer;

export default stockReducer;
