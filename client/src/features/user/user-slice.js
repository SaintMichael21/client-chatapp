import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: true,
  user: {},
  errorMsg: "",
  email: "",
  password: "",
  username: "",
  allUser: [],
};

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    fetchPendingAllUser(state) {
      state.isLoading = true;
      state.allUser = [];
      state.errorMsg = "";
    },
    fetchSuccessAllUser(state, action) {
      state.isLoading = false;
      state.allUser = action.payload;
    },
    fetchPendingUser(state) {
      state.isLoading = true;
      state.allUser = {};
      state.errorMsg = "";
    },
    fetchSuccessUser(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },
    fetchReject(state, action) {
      state.isLoading = false;
      state.errorMsg = action.payload;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setUsername,
  fetchPendingAllUser,
  fetchPendingUser,
  fetchReject,
  fetchSuccessAllUser,
  fetchSuccessUser,
} = userSlice.actions;

//fungsi dipake sama thunk
export const getUser = () => {
  return async (dispatch, _getstate) => {
    try {
      dispatch(fetchPendingUser());
      const { data } = await axios.get(
        `https://chatapp-server.saintmichael.cloud/user`,
        {
          headers: { Authorization: `Bearer ${localStorage.access_token}` },
        }
      );
      dispatch(fetchSuccessUser(data));
    } catch (error) {
      dispatch(fetchReject(error.message));
    }
  };
};

export const getAllUsers = () => {
  return async (dispatch, _getstate) => {
    try {
      dispatch(fetchPendingAllUser());
      const { data } = await axios.get(
        `https://chatapp-server.saintmichael.cloud/all-user`,
        {
          headers: { Authorization: `Bearer ${localStorage.access_token}` },
        }
      );
      dispatch(fetchSuccessAllUser(data));
    } catch (error) {
      dispatch(fetchReject(error.message));
    }
  };
};

export default userSlice.reducer;
