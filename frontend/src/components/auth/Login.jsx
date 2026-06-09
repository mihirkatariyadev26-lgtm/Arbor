import React, { useContext, useState } from "react";
import Navbar from "../Navbar";
import "./Login.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post(
        "https://arbor-backend-qr7t.onrender.com/login",
        {
          password: password,
          email: email,
        },
      );
      const token = res.data.token;
      const userId = res.data.userId;
      const userName = res.data.userName;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      setCurrentUser(userId);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login is failed");
      setLoading(false);
    }
  };
  return (
    <>
      <div className="auth">
        <Navbar />
        <div className="content">
          <Box className="form">
            <h2>Login</h2>
            <div className="field">
              <TextField
                id="filled-basic"
                label="Email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                variant="filled"
              />
            </div>
            <div className="field">
              <TextField
                id="filled-basic"
                type="password"
                required
                label="Password"
                variant="filled"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div
              className="btn"
              type="button"
              onClick={handleLogin}
              disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </div>
            <p>
              Do You want to Create an account ?<span>SignUp</span>
            </p>
          </Box>
        </div>
      </div>
      <script src="../dashboard/Dashboard.jsx" rel="preload"></script>
    </>
  );
}

export default Login;
