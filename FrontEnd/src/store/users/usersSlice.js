import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUsersLoading: false,
  users: {},
  pageCount: 0,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload.items;
      state.pageCount = action.payload.pageCount;
    },
    setLoadedUsers(state) {
      state.isUsersLoading = false;
    },
    setLoadingUsers(state) {
      state.isUsersLoading = true;
    },
  },
});

export const { setUsers, setLoadedUsers, setLoadingUsers } = usersSlice.actions;
const usersReducer = usersSlice.reducer;

export default usersReducer;
