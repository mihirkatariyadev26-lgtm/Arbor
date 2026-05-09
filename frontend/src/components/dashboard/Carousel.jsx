import React, { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import axios from "axios";
const Carousel = () => {
  const scrollRef = useRef(null);
  const [repoData, setRepodata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStared, setIsStared] = useState(false);
  useEffect(() => {
    const fetchReposData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/repo/all");
        setRepodata(res.data);
        setLoading(false);
        console.log(res.data);
      } catch (e) {
        console.log("Error to get All repository", e);
        setRepodata([]);
      } finally {
        // console.log(repoData);
        setLoading(false);
      }
    };
    fetchReposData();
  }, []);

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
                    <p>Repository Name: {e.name}</p>
                    <p>Published By: {e.owner.username}</p>
                  </div>

                  <div className="repo-description">
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "transparent",
                      }}>
                      <p>Description: </p>
                      {!isStared ? (
                        <StarBorderOutlinedIcon
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "2rem",
                            marginRight: "1rem",
                          }}
                          onClick={() => setIsStared(!isStared)}
                        />
                      ) : (
                        <StarOutlinedIcon
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "2rem",
                            marginRight: "1rem",
                          }}
                          onClick={() => setIsStared(!isStared)}
                        />
                      )}
                    </span>
                    <div className="description">{e.description}</div>
                    <div className="repo-issue">
                      <p>Issues : {e.issues.length}</p>
                    </div>
                    <div className="button">
                      <div className="Issue-Page">Explore Repository</div>
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
