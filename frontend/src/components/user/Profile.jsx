import React, { useState } from "react";
import Navbar from "../Navbar";
import "./Profile.css";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import PublicIcon from "@mui/icons-material/Public";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { useNavigate, useParams } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  if (!name) return { sx: { bgcolor: "#000" }, children: "?" };
  const nameParts = name.trim().split(" ");
  let children = "";
  if (nameParts.length === 1) {
    children = nameParts[0][0].toUpperCase();
  } else if (nameParts.length >= 2) {
    children = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children,
  };
}
function Profile() {
  const [loading, setLoading] = useState(true);
  const [userRepo, setUserRepo] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [follow, setFollow] = useState(() => {
    const saved = localStorage.getItem("followedUsers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const map = {};
        parsed.forEach((id) => {
          map[id] = true;
        });
        return map;
      } catch (e) {
        console.log("Failed to parse followed users from localStorage", e);
      }
    }
    return {};
  });
  useEffect(() => {
    const fetchUserFollowing = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/getUserProfile/${userId}`,
        );
        const user = res.data;
        if (user.followedUsers && Array.isArray(user.followedUsers)) {
          localStorage.setItem(
            "followedUsers",
            JSON.stringify(user.followedUsers),
          );
          const map = {};
          user.followedUsers.forEach((id) => {
            map[id] = true;
          });
          setFollow(map);
        }
      } catch (e) {
        console.log("Error Getting followed Users", e);
      }
    };
    fetchUserFollowing();
  }, []);
  const { id } = useParams();
  const Navigate = useNavigate();
  useEffect(() => {
    const fetchUserRepo = async () => {
      try {
        if (localStorage.getItem("userId")) {
          setLoading(true);
          const res = await axios.get(
            `https://arbor-backend-qr7t.onrender.com/repo/user/${id}`,
          );
          setUserRepo(res.data);
          setLoading(false);
          console.log(res.data);
        }
      } catch (e) {
        console.log("Error occured during fetchiing the Users Repository", e);
        setLoading(false);
      } finally {
        setLoading(false);
        //  console.log(id);
      }
    };
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/getUserProfile/${id}`,
        );
        setUserDetail(res.data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log("Error while fetching the user profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchUserRepo();
  }, [id]);
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `https://arbor-backend-qr7t.onrender.com/repo/delete/${id}`,
      );
      console.log(res);
      setUserRepo((prevRepos) => prevRepos.filter((repo) => repo._id !== id));
    } catch (e) {
      console.log("Error while deleting the repo", e);
    }
  };
  //TODO:make handle unfollow and then store in localstorage for frontend reference to manage the state of follow btn
  //DEBUGING NEEDED
  const handleFollow = async (targetId) => {
    try {
      const res = await axios.post(
        "https://arbor-backend-qr7t.onrender.com/user/follow",
        {
          currentUser: localStorage.getItem("userId"),
          followingUser: targetId || id,
        },
      );
      const updateUser = res.data;
      if (updateUser.followedUsers && Array.isArray(updateUser.followedUsers)) {
        localStorage.setItem(
          "followedUsers",
          JSON.stringify(updateUser.followedUsers),
        );
        const map = {};
        updateUser.followedUsers.forEach((followedIdUser) => {
          map[followedIdUser] = true;
        });
        setFollow(map);
      }
    } catch (e) {
      console.log("Error while following", e);
    }
  };
  const toggleVisibility = async (id) => {
    try {
      const res = await axios.patch(
        `https://arbor-backend-qr7t.onrender.com/repo/toggle/${id}`,
      );
      console.log(res.data);
      setUserRepo((prevRepos) =>
        prevRepos.map((repo) =>
          repo._id === id ? { ...repo, visibility: !repo.visibility } : repo,
        ),
      );
    } catch (e) {
      console.log("Error accured during toggle the visibility", e);
    }
  };
  return (
    <>
      <div className="userProfilePage">
        <Navbar />
        <div id="Profilecontainer">
          <div id="Profile">
            <Grid container spacing={3} id="Profile-Grid">
              <Grid size={3.2} id="side">
                <div id="username">
                  <Stack direction="row" id="logo" spacing={2}>
                    <Avatar {...stringAvatar(userDetail.username)} />
                    <p>
                      {userDetail.username}
                      <br />
                      <span
                        style={{
                          fontSize: "0.9rem",
                          backgroundColor: "transparent",
                          display: "flex",
                          flexWrap: "wrap",
                          textWrap: "wrap",
                          wordWrap: "break-word",
                          wordBreak: "break-all",
                          textSizeAdjust: "auto",
                          overflow: "hidden",
                        }}>
                        UID : {userDetail._id}
                      </span>
                    </p>
                  </Stack>
                  <p>Repositories : {userRepo.length}</p>
                  {userDetail._id !== localStorage.getItem("userId") &&
                  follow[userDetail._id] ? (
                    <div
                      className="drawer unfollow"
                      style={{
                        width: "78%",
                        paddingInline: "1.25rem",
                        marginInline: "auto",
                        marginTop: "1rem",
                      }}
                      onClick={() => {
                        handleFollow(id);
                      }}>
                      Unfollow
                    </div>
                  ) : (
                    <div
                      className="drawer follow"
                      style={{
                        width: "78%",
                        paddingInline: "1.25rem",
                        marginInline: "auto",
                        marginTop: "1rem",
                      }}
                      onClick={() => {
                        handleFollow(id);
                      }}>
                      Follow
                    </div>
                  )}
                </div>
                {/* this is the drawer section */}
                <div
                  className="drawer-container"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "end",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    minHeight: "75%",
                    maxHeight: "fit-content",
                  }}>
                  <div
                    style={{
                      height: "fit-content",
                      alignItems: "end",
                      width: "100%",
                      marginBottom: "0px",
                    }}>
                    {userDetail._id === localStorage.getItem("userId") ? (
                      <>
                        <div className="drawer">Access Token</div>
                        <div className="drawer">Feedback</div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </Grid>

              <Grid size={8.7} id="MainPannel">
                <h1 style={{ marginTop: "1rem" }}>Your Repositories</h1>
                <div className="userRepo">
                  {loading ? (
                    <p>Loading the Data</p>
                  ) : userRepo.length > 0 ? (
                    userRepo.map((e) => {
                      return (
                        <div className="repository" key={e._id}>
                          <div
                            className="name"
                            style={{
                              fontSize: "1.2rem",
                              width: "30%",
                              backgroundColor: "transparent",
                            }}>
                            {e.name}
                            <div
                              className="visibility-status"
                              style={{
                                fontSize: "1rem",
                                backgroundColor: "transparent",
                              }}>
                              {e.visibility ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "transparent",
                                  }}>
                                  <PublicIcon />
                                  <span
                                    style={{ backgroundColor: "transparent" }}>
                                    Public
                                  </span>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "transparent",
                                  }}>
                                  <ShieldOutlinedIcon />
                                  <span
                                    style={{ backgroundColor: "transparent" }}>
                                    Privet
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              backgroundColor: "transparent",
                            }}>
                            Issues :{e.issues.length}
                            {userDetail._id ===
                            localStorage.getItem("userId") ? (
                              <div
                                className="deleteRepo"
                                style={{ backgroundColor: "transparent" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "0.25rem",
                                    marginLeft: "2rem",
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => {
                                    handleDelete(e._id);
                                  }}>
                                  <DeleteIcon></DeleteIcon>Delete
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "0.25rem",
                                    marginLeft: "2rem",
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => {
                                    Navigate(`/Edit/${e._id}`);
                                  }}>
                                  <BorderColorOutlinedIcon />
                                  Edit
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "0.25rem",
                                    marginLeft: "2rem",
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                  }}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={e.visibility}
                                        onChange={() => toggleVisibility(e._id)}
                                      />
                                    }
                                    label={e.visibility ? "Public" : "Privet"}
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>No Repository Created Yet</p>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
