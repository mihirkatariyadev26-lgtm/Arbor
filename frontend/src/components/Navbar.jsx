import React from "react";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogedin, setIsLogedin] = useState(false);
  useEffect(() => {
    setIsLogedin(!!localStorage.getItem("token"));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLogedin(false);
    navigate("/");
  };
  return (
    <>
      <div className="navbar-out">
        <div className="navbar">
          <div
            className="Logo"
            onClick={() => {
              navigate("/");
            }}>
            <div className="logo"></div>
            <div className="Name">ARBOR</div>
          </div>
          <div className="option-group">
            <div
              className="option"
              onClick={() => {
                navigate("/docs");
              }}>
              Docs
            </div>
            {isLogedin ? (
              <div className="option" onClick={handleLogout}>
                Logout
              </div>
            ) : (
              <>
                <div
                  className="option"
                  onClick={() => {
                    navigate("/auth");
                  }}>
                  Login
                </div>
                <div
                  className="option"
                  onClick={() => {
                    navigate("/signup");
                  }}>
                  SignUp
                </div>
              </>
            )}

            {location.pathname !== "/dashboard" && (
              <div
                className="option"
                onClick={() => {
                  localStorage.getItem("token")
                    ? navigate("/dashboard")
                    : navigate("/auth");
                }}>
                Dashborard
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
