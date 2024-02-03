import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUseresLoading: false,
  users: {},
  pageCount: 0
};

const usersSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedUsers(state, action) {
      state.isUseresLoading = false;
    },
    setLoadingUsers(state, action) {
      state.isUseresLoading = true;
    },
  },
});

export const { setUsers, setLoadedUsers, setLoadingUsers } = usersSlice.actions;
const usersReducer = usersSlice.reducer;

export default usersReducer;
