import React, { useState } from "react";
import Navbar from "../Navbar";
import "./Profile.css";
import { useRef, useEffect } from "react";
import DotGrid from "../hero";
import Carousel from "../dashboard/Carousel";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import PublicIcon from "@mui/icons-material/Public";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
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
  const userID = localStorage.getItem("userId");
  useEffect(() => {
    const fetchUserRepo = async () => {
      try {
        if (localStorage.getItem("userId")) {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:3000/repo/user/${localStorage.getItem("userId")}`,
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
      }
    };
    fetchUserRepo();
  }, []);
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`http://localhost:3000/repo/delete/${id}`);
      console.log(res);
      setUserRepo((prevRepos) => prevRepos.filter((repo) => repo._id !== id));
      setLoading(false);
    } catch (e) {
      console.log("Error while deleting the repo", e);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="userProfilePage">
        <Navbar />
        <div id="Profilecontainer">
          <div id="Profile">
            <Grid container spacing={3} id="Profile-Grid">
              <Grid size={2.9} id="side">
                <div id="username">
                  <Stack direction="row" id="logo" spacing={2}>
                    <Avatar
                      {...stringAvatar(localStorage.getItem("userName"))}
                    />
                    <p>
                      {localStorage.getItem("userName")}
                      <br />
                      <span
                        style={{
                          fontSize: "0.9rem",
                          backgroundColor: "transparent",
                          display: "flex",
                          flexWrap: "wrap",
                          textWrap: "wrap",
                          textSizeAdjust: "auto",
                        }}>
                        UID: {userID}
                      </span>
                    </p>
                  </Stack>
                </div>
                {/* this is the drawer section */}
                <div className="drawer">Access Token</div>
                <div className="drawer">Feedback</div>
              </Grid>

              <Grid size={9} id="MainPannel">
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
                            }}>
                            {e.name}
                            <div
                              className="visibility-status"
                              style={{ fontSize: "1rem" }}>
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
                          <div>
                            Issues :{e.issues.length}
                            <div
                              className="deleteRepo"
                              style={{ display: "flex", alignItems: "center" }}
                              onClick={() => {
                                handleDelete(e._id);
                              }}>
                              <DeleteIcon></DeleteIcon>Delete
                            </div>
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
