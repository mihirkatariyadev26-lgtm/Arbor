import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import "./dashboard.css";
import DataSaverOnOutlinedIcon from "@mui/icons-material/DataSaverOnOutlined";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Carousel from "./Carousel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Help from "../help/help";
import "../repository/UserRepolist.css";
import axios from "axios";
import PublicIcon from "@mui/icons-material/Public";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";

function Dashboard() {
  const navigate = useNavigate();
  const [repoData, setRepodata] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staredRepos, setStaredRepos] = useState(() => {
    const saved = localStorage.getItem("starRepos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const map = {};
        parsed.forEach((id) => {
          map[id] = true;
        });
        return map;
      } catch (e) {
        console.log("Failed to parse starRepos from localStorage", e);
      }
    }
    return {};
  });
  useEffect(() => {
    const fetchUserRepo = async () => {
      try {
        setLoading(true);
        const cleanid = localStorage
          .getItem("userId")
          .trim()
          .replace(/['"]+/g, "");
        // console.log(cleanid);
        const res2 = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/repo/user/${cleanid}`,
        );
        setList(res2.data);
        setLoading(false);
        console.log(res2.data);
        return res2.data;
      } catch (e) {
        console.log("error in fetching ", e);
        setList([]);
      } finally {
        setLoading(false);
      }

      return list;
    };
    fetchUserRepo();
  }, []);

  useEffect(() => {
    const fetchReposData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://arbor-backend-qr7t.onrender.com/repo/all",
        );
        setRepodata(res.data);
        console.log(repoData);
      } catch (e) {
        console.log("Error to get All repository", e);
        setRepodata([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStars = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/getUserProfile/${userId}`,
        );
        const user = res.data;
        if (user.starRepos && Array.isArray(user.starRepos)) {
          localStorage.setItem("starRepos", JSON.stringify(user.starRepos));
          const map = {};
          user.starRepos.forEach((id) => {
            map[id] = true;
          });
          setStaredRepos(map);
        }
      } catch (e) {
        console.log("Error getting user profile", e);
      }
    };

    fetchReposData();
    fetchUserStars();
  }, []);
  const handelStarRepo = async (id) => {
    try {
      const res = await axios.post(
        "https://arbor-backend-qr7t.onrender.com/repo/star",
        {
          repoId: id,
          userId: localStorage.getItem("userId"),
        },
      );
      const updatedUser = res.data;
      if (updatedUser.starRepos && Array.isArray(updatedUser.starRepos)) {
        localStorage.setItem(
          "starRepos",
          JSON.stringify(updatedUser.starRepos),
        );
        const map = {};
        updatedUser.starRepos.forEach((repoId) => {
          map[repoId] = true;
        });
        setStaredRepos(map);
      }
    } catch (e) {
      console.log("Error in staring repository", e);
    }
  };

  return (
    <div className="Dashboard">
      <Navbar />
      <div className="main">
        <div className="Nav">
          <div className="nav">
            <div
              className="profile"
              onClick={() => {
                navigate(`/profile/${localStorage.getItem("userId")}`);
              }}>
              <div className="profile-icon">
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ backgroundColor: "transparent" }}></Stack>
              </div>
              <div className="username">{localStorage.getItem("userName")}</div>
            </div>
            <div className="options">
              <div
                className="Option"
                onClick={() => {
                  navigate("/RepoForm");
                }}>
                <DataSaverOnOutlinedIcon />
                <p>New Repository</p>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            height: "100%",
            // border: "1px solid white",
            width: "95%",
            borderRadius: "2rem",
            display: "flex",
            justifyContent: "space-around",
            paddingBlock: "1rem",
            boxShadow: "0 0 3vh rgba(37, 50, 134, 0.511)",
            marginBottom: "0.38rem",
          }}>
          <div
            style={{
              // border: "1px solid white",
              boxShadow: "0 0 1vh rgba(255, 255, 255, 0.447)",
              width: "25%",
              borderRadius: "2rem",
            }}>
            <p
              style={{
                marginLeft: "0.25rem",
                fontSize: "1.5rem",
                textAlign: "center",
                height: "fit-content",
                width: "100%",
                paddingTop: "1rem",
                backgroundColor: "transparent",
              }}>
              Your Repositories
            </p>
            <div
              style={{
                marginTop: "1.5rem",
                width: "95%",
                height: "55vh",
                overflowY: "scroll",
                scrollbarWidth: "none",
                marginLeft: "0.5rem",
                borderRadius: "1rem",
                flexWrap: "wrap",
                backgroundColor: "transparent",
              }}>
              {loading ? (
                <p
                  style={{
                    backgroundColor: "transparent",
                    textAlign: "center",
                  }}>
                  Loading Repositories
                </p>
              ) : list.length > 0 ? (
                list.map((e) => {
                  return (
                    <div
                      key={e._id}
                      className="repo"
                      style={{
                        justifyContent: "space-between",
                        marginLeft: "2.5%",
                      }}
                      onClick={() => {
                        navigate(`/repo/${e._id}`);
                      }}>
                      {e.name}
                      <div style={{ width: "10%", paddingRight: "1.25rem" }}>
                        {e.visibility ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}>
                            <PublicIcon />
                            <span>Public</span>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}>
                            <ShieldOutlinedIcon />
                            <span>Privet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ backgroundColor: "transparent" }}>
                  No Repositories
                </p>
              )}
            </div>
          </div>
          <div
            style={{
              // border: "1px solid white",
              boxShadow: " 0 0 1vh rgba(255, 255, 255, 0.511)",
              width: "70%",
              borderRadius: "2rem",
            }}>
            <p
              style={{
                marginLeft: "0.25rem",
                fontSize: "1.5rem",
                textAlign: "center",
                height: "fit-content",
                width: "100%",
                paddingTop: "1rem",
                backgroundColor: "transparent",
              }}>
              All Repositories
            </p>
            <div
              id="scrollable"
              style={{
                height: "55vh",
                marginTop: "1rem",
                // border: "1px solid white",
                width: "95%",
                marginInline: "2.5%",
                borderRadius: "2rem",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}>
              {loading ? (
                <p
                  style={{
                    height: "100%",
                    width: "100%",
                    alignContent: "center",
                    textAlign: "center",
                  }}>
                  Fetching Repositories...
                </p>
              ) : repoData.length > 0 ? (
                repoData.map((e) => {
                  const commitsArray = Array.isArray(e.commits)
                    ? e.commits
                    : [];
                  // Count total commit entries (top-level array length)
                  const commitsLength = commitsArray.length;

                  // Collect all commit date strings found in the commit objects (handles multiple entries and nested arrays)
                  const allDates = [];
                  commitsArray.forEach((c) => {
                    if (!c) return;
                    if (c.commitDate) allDates.push(c.commitDate);
                    // support nested arrays in case commit groups contain arrays
                    if (Array.isArray(c.commits)) {
                      c.commits.forEach(
                        (nc) =>
                          nc && nc.commitDate && allDates.push(nc.commitDate),
                      );
                    }
                  });

                  let latestCommitDate = "No commits";
                  if (allDates.length > 0) {
                    const latest = allDates.reduce((a, b) =>
                      new Date(a) > new Date(b) ? a : b,
                    );
                    latestCommitDate = new Date(latest).toLocaleString();
                  }
                  return (
                    <div
                      id="repository"
                      key={e._id}
                      style={{
                        height: "fit-content",
                        // border: "1px solid white",
                        boxShadow: " 0 0 1vh rgba(255, 255, 255, 0.511)",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        width: "95%",
                        marginInline: "2.5%",
                        borderRadius: "1rem",
                        paddingBlock: "1rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          " 0 0 2vh rgba(18, 18, 184, 0.511)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          " 0 0 1vh rgba(255, 255, 255, 0.511)";
                      }}>
                      <div
                        id="name_star"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingInline: "1rem",
                          backgroundColor: "transparent",
                        }}>
                        <div
                          id="name"
                          style={{ backgroundColor: "transparent" }}>
                          <p
                            style={{ fontSize: "1rem", zIndex: "100" }}
                            onClick={() => {
                              navigate(`/profile/${e.owner._id}`);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.cursor = "pointer";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.cursor = "arrow";
                            }}>
                            Posted By : {e.owner.username}
                          </p>
                          Repository Name : {e.name} <br />
                          <p style={{ fontSize: "1.05rem" }}>
                            Issues : {e.issues.length}
                          </p>
                        </div>
                        <div id="star" style={{ marginRight: "5px" }}>
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
                        </div>
                      </div>
                      <div id="description" style={{ paddingInline: "1rem" }}>
                        Description : {e.description}
                      </div>
                      <div id="Content" style={{ paddingInline: "1rem" }}>
                        Content : {e.content}
                      </div>
                      <div id="count-commit" style={{ paddingInline: "1rem" }}>
                        Commits: {commitsLength}
                        <br />
                        Latest Commit Date: {latestCommitDate}
                      </div>
                      <div
                        id="Content"
                        style={{
                          paddingBlock: ".75rem",
                          backgroundColor: "white",
                          color: "black",
                          width: "10%",
                          marginLeft: "89%",
                          textAlign: "center",
                          fontWeight: "800",
                          marginTop: "1rem",
                          borderRadius: "2rem",
                          fontSize: "1.25rem",
                        }}
                        onClick={() => {
                          navigate(`/repo/${e._id}`);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.cursor = "pointer";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.cursor = "pointer";
                        }}>
                        Explore
                      </div>
                    </div>
                  );
                })
              ) : (
                <p
                  style={{
                    height: "100%",
                    width: "100%",
                    alignContent: "center",
                    textAlign: "center",
                  }}>
                  No Repository Found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
