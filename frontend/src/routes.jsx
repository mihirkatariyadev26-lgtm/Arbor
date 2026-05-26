import React, { useEffect } from "react";
import { useAuth } from "./authContext.jsx";
import { useNavigate, useRoutes } from "react-router-dom";
import Home from "./home.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import CreateRepo from "./components/repository/CreateRepo.jsx";
import EditRepo from "./components/repository/EditRepo.jsx";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }
    if (
      !token &&
      !["/auth", "/signup", "/"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }
    if (
      (token && window.location.pathname === "/auth") ||
      (token && window.location.pathname === "/signup")
    ) {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/RepoForm", element: <CreateRepo /> },
    { path: "/profile", element: <Profile /> },
    { path: "/Edit/:id", element: <EditRepo /> },
  ]);
  return element;
};

export default ProjectRoutes;
