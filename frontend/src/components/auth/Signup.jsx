import React, { useState } from "react";
import Navbar from "../Navbar";
import "./Login.css";
import { useAuth } from "../../authContext";
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import axios from "axios";
function Signup() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/signup", {
        username: userName,
        password: password,
        email: email,
      });
      const token = res.data.token;
      const userId = res.data.userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      setCurrentUser(res.data.userId);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Signup is failed");
      setLoading(false);
    }
  };
  return (
    <>
      <div className="auth">
        <Navbar />
        <div className="content">
          <Box className="form">
            <h2>SignUp</h2>
            <div className="field">
              <TextField
                required
                id="filled-basic"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                variant="filled"
              />
            </div>
            <div className="field">
              <TextField
                required
                id="filled-basic"
                value={userName}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                label="Username"
                variant="filled"
              />
            </div>
            <div className="field">
              <TextField
                required
                id="filled-basic"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="Password"
                variant="filled"
              />
            </div>
            <div
              className="btn"
              onClick={handleSignUp}
              disabled={loading}
              type="button">
              {loading ? "Loading..." : "SignUP"}
            </div>
            <p>
              Already have an account ?
              <span
                onClick={() => {
                  navigate("/auth");
                }}>
                Login
              </span>
            </p>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Signup;
