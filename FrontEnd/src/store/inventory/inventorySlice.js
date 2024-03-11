import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isInventoryLoading: false,
  inventory: {},
  pageCount: 0,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory(state, action) {
      state.inventory = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedInventory(state, action) {
      state.isInventoryLoading = false;
    },
    setLoadingInventory(state, action) {
      state.isInventoryLoading = true;
    },
  },
});

export const { setInventory, setLoadedInventory, setLoadingInventory } = inventorySlice.actions;
const inventoryReducer = inventorySlice.reducer;

export default inventoryReducer;
