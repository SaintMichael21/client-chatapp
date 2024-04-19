import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  messages: [],
  messageSent: "",
  isLoading: true,
  errorMsg: "",
};

const messageSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setMessageSent(state, action) {
      state.messageSent = action.payload;
    },
    fetchPendingMessages(state, action) {
      state.isLoading = true;
      state.errorMsg = "";
      state.messages = [];
    },
    fetchSuccessMessages(state, action) {
      state.isLoading = false;
      state.messages = action.payload;
    },
    fetchReject(state, action) {
      state.isLoading = false;
      state.errorMsg = action.payload;
    },
  },
});

const {
  setMessages,
  setMessageSent,
  fetchPendingMessages,
  fetchReject,
  fetchSuccessMessages,
} = messageSlice.actions;

export const getMessages = () => {
  return async (dispatch, _getstate) => {
    try {
      dispatch(fetchPendingMessages());
      const { data } = await axios.get(
        `https://chatapp-server.saintmichael.cloud/all-messages`,
        {
          headers: { Authorization: `Bearer ${localStorage.access_token}` },
        }
      );
      dispatch(fetchSuccessMessages(data));
    } catch (error) {
      dispatch(fetchReject(error.message));
    }
  };
};

export default messageSlice.reducer;
