import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/user-slice.js";
import messageReducer from "../features/message/message-slice.js";
import profileReducer from "../features/profile/profile-slice.js";
export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    profile: profileReducer,
  },
});
