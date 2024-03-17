import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isExpensesLoading: false,
  expenses: {},
  pageCount: 0,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedExpenses(state, action) {
      state.isExpensesLoading = false;
    },
    setLoadingExpenses(state, action) {
      state.isExpensesLoading = true;
    },
  },
});

export const { setExpenses, setLoadedExpenses, setLoadingExpenses } = expensesSlice.actions;
const expensesReducer = expensesSlice.reducer;

export default expensesReducer;
