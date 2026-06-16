import React from "react";
import "./home.css";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <Navbar />
      <div
        style={{
          width: "95%",
          height: "80%",
          marginTop: "1.05rem",
          display: "flex",
          alignItems: "center",
          borderRadius: "2rem",
          marginLeft: "2.5%",
          boxShadow: "0 0 2vh rgba(37, 50, 134, 0.511)",
        }}>
        <div
          id="Container"
          style={{
            height: "100%",
            backgroundColor: "transparent",
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}>
          <div
            id="left"
            style={{
              height: "100%",
              // border: "1px solid white",
              backgroundColor: "transparent",
              width: "30%",
              display: "flex",
              alignItems: "center",
              paddingInline: "1rem",
              justifyContent: "center",
            }}>
            <div style={{ backgroundColor: "transparent" }}>
              <div
                style={{
                  fontSize: "5rem",
                  fontWeight: "800",
                  textShadow: "2vh 2vh 100vh rgba(37, 50, 134, 0.511)",
                  color: "forestgreen",
                  backgroundColor: "transparent",
                }}>
                Build ,
              </div>
              <div
                style={{
                  backgroundColor: "transparent",
                  fontSize: "4.5rem",
                  fontWeight: "800",
                  color: " rgb(77, 101, 255)",
                }}>
                Innovate{" "}
                <span
                  style={{ backgroundColor: "transparent", fontSize: "3rem" }}>
                  And ,
                </span>
              </div>
              <div
                style={{
                  backgroundColor: "transparent",
                  fontSize: "3rem",
                  fontWeight: "700",
                  wordSpacing: "0.25rem",
                  marginTop: "1rem",
                  textShadow: "2vh 2vh 100vh rgba(37, 50, 134, 0.511)",
                  color: "aqua",
                }}>
                Version Your Way
              </div>
              <div
                style={{
                  marginTop: "2rem",
                  justifyContent: "center",
                  width: "fit-content",
                  height: "fit-content",
                  backgroundColor: "white",
                  color: "black",
                  padding: "1.5rem",
                  fontSize: "1.5rem",
                  borderRadius: "2rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.cursor = "arrow";
                }}
                onClick={() => {
                  localStorage.getItem("token")
                    ? navigate("/dashboard")
                    : navigate("/auth");
                }}>
                Get Started
              </div>
            </div>
          </div>
          <div
            id="img"
            style={{
              height: "80%",
              backgroundImage: "url('/home.png')",
              width: "60%",
              justifyContent: "center",
              alignItems: "center",
              backgroundSize: "cover",
              borderRadius: "2rem",
              display: "flex",
              backgroundRepeat: "no-repeat",
              marginTop: "5%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                " 0 0 2vh rgba(18, 18, 184, 0.511)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = " 0 0 1vh transparent";
            }}></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
