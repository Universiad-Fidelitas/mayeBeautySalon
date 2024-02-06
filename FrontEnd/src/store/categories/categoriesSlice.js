import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCategoriesLoading: false,
  categories: {},
  pageCount: 0,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedCategories(state, action) {
      state.isCategoriesLoading = false;
    },
    setLoadingCategories(state, action) {
      state.isCategoriesLoading = true;
    },
  },
});

export const { setCategories, setLoadedCategories, setLoadingCategories } = categoriesSlice.actions;
const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;
