import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBrandsLoading: false,
  brands: {},
  pageCount: 0,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands(state, action) {
      state.brands = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedBrands(state) {
      state.isBrandsLoading = false;
    },
    setLoadingBrands(state) {
      state.isBrandsLoading = true;
    },
  },
});

export const { setBrands, setLoadedBrands, setLoadingBrands } = brandsSlice.actions;
const brandsReducer = brandsSlice.reducer;

export default brandsReducer;
