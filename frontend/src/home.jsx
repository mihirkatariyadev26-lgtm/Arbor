import React from "react";
import "./home.css";
import Navbar from "./components/Navbar";
function Home() {
  return (
    <>
      <div className="home">
        <Navbar />
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          hello
        </div>
      </div>
    </>
  );
}

export default Home;
