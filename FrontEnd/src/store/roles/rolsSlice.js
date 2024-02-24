import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRolesLoading: false,
  rols: {},
  pageCount: 0,
};

const rolsSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRols(state, action) {
      state.rols = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedRols(state, action) {
      state.isRolesLoading = false;
    },
    setLoadingRols(state, action) {
      state.isRolesLoading = true;
    },
  },
});

export const { setRols, setLoadedRols, setLoadingRols } = rolsSlice.actions;
const rolsReducer = rolsSlice.reducer;

export default rolsReducer;
