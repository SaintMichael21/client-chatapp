import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";
import { io } from "socket.io-client";
import BaseLayout from "../layouts/BaseLayout";
import ChatPage from "../views/ChatPage";
import ProfilePage from "../views/ProfilePage";

const url = `http://35.198.239.246`;

const socket = io("http://35.198.239.246", {
  autoConnect: false,
});

const router = createBrowserRouter([
  {
    path: "*",
    loader: () => {
      return redirect("/login");
    },
  },
  {
    path: "/login",
    element: <LoginPage url={url} socket={socket} />,
    loader: () => {
      if (localStorage.access_token) {
        return redirect("/chat-page");
      }
      return null;
    },
  },
  {
    path: "/register",
    element: <RegisterPage url={url} socket={socket} />,
    loader: () => {
      if (localStorage.access_token) {
        return redirect("/chat-page");
      }
      return null;
    },
  },
  {
    element: <BaseLayout url={url} socket={socket} />,
    loader: () => {
      if (!localStorage.access_token) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: "/chat-page",
        element: <ChatPage url={url} socket={socket} />,
      },
      {
        path: "/profile-page",
        element: <ProfilePage url={url} socket={socket} />,
      },
    ],
  },
]);

export default router;
