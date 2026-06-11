import React, { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const Carousel = () => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const firstCard = current.querySelector(".carousel-card");
      const cardWidth = firstCard.offsetWidth + 20; // card width + gap

      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="carousel-container">
      {/* Navigation Buttons */}
      <button
        className="nav-btn left"
        onClick={() => scroll("left")}
        aria-label="Scroll Left">
        &#10094;
      </button>

      <div className="carousel-view" ref={scrollRef}>
        {/* {console.log(repoData)} */}
        {loading ? (
          <p>Loading data</p>
        ) : repoData.length > 0 ? (
          repoData.map((e) => {
            return (
              <div
                key={e._id}
                className="carousel-card"
                style={{
                  background: `linear-gradient(225deg, #000000, #222)`,
                }}>
                <div className="Repo-detail">
                  <div className="top">
                    <p>Repository Name : {e.name}</p>
                    <p
                      onClick={() => {
                        // console.log(userId);
                        navigate(`/profile/${e.owner._id}`);
                      }}
                      style={{ cursor: "pointer" }}>
                      Published By : {e.owner.username}
                    </p>
                  </div>

                  <div className="repo-description">
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "transparent",
                      }}>
                      <p>Description : </p>
                      {!staredRepos[e._id] ? (
                        <StarBorderOutlinedIcon
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "2rem",
                            marginRight: "1rem",
                            transition: "all 0.2s ease",
                          }}
                          className="hover"
                          onClick={() => handelStarRepo(e._id)}
                        />
                      ) : (
                        <StarOutlinedIcon
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "2rem",
                            marginRight: "1rem",
                          }}
                          className="hover"
                          onClick={() => handelStarRepo(e._id)}
                        />
                      )}
                    </span>
                    <div
                      className="description"
                      style={{ textOverflow: "clip" }}>
                      {e.description}
                    </div>
                    <div
                      className="description"
                      style={{ marginLeft: "0", alignItems: "center" }}>
                      <p>Content: </p>
                      <span
                        style={{
                          marginInline: "0.75rem",
                          display: "inline-block",
                          paddingTop: "0.5rem",
                          textOverflow: "clip",
                        }}>
                        {e.content}
                      </span>
                    </div>
                    <div className="repo-issue">
                      <p>Issues : {e.issues.length}</p>
                    </div>
                    <div className="button">
                      <div
                        className="Issue-Page"
                        onClick={() => {
                          navigate(`/repo/${e._id}`);
                        }}>
                        Explore Repository
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: "center" }}>No repo found</p>
        )}
      </div>

      <button
        className="nav-btn right"
        onClick={() => scroll("right")}
        aria-label="Scroll Right">
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
