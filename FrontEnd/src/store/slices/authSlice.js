import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  currentUser: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
    },
    setLogoutUser(state) {
      state.currentUser = {};
      state.isLogin = false;
    },
  },
});

export const { setCurrentUser, setLogoutUser } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
