// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null, // null means no user is logged in
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setlogin: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      },
    setlogout(state) {
      state.user = null;
      state.token=null;
    },
  },
});

export const { setlogin, setlogout } = authSlice.actions;
export default authSlice.reducer;
