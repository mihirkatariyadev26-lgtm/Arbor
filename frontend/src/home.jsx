import React from "react";
import "./home.css";
import DotGrid from "./components/hero";
import Navbar from "./components/Navbar";
function Home() {
  return (
    <>
      <div className="home">
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#2F293A"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
