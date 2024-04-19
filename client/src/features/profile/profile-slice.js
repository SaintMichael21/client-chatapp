import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  profile: { undefined },
  isLoading: true,
  errorMsg: "",
};

const profileSlice = createSlice({
  name: "profiles",
  initialState: initialState,
  reducers: {
    fetchPending(state, action) {
      state.isLoading = true;
      state.errorMsg = "";
      state.profile = {};
    },
    fetchSuccess(state, action) {
      state.isLoading = false;
      state.profile = action.payload;
    },
    fetchReject(state, action) {
      state.isLoading = false;
      state.errorMsg = action.payload;
    },
  },
});

const { fetchPending, fetchReject, fetchSuccess } = profileSlice.actions;

export const fetchProfile = () => {
  return async (dispatch, _getstate) => {
    try {
      dispatch(fetchPending());
      const { data } = await axios.get(
        `http://chatapp-server.saintmichael.cloud/user`,
        {
          headers: { Authorization: `Bearer ${localStorage.access_token}` },
        }
      );
      dispatch(fetchSuccess(data));
    } catch (error) {
      dispatch(fetchReject());
    }
  };
};

export default profileSlice.reducer;
