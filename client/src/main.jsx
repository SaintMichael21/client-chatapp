import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="942868791483-klpeb9skbchrc9mcjdhpaulrod0clglk.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
