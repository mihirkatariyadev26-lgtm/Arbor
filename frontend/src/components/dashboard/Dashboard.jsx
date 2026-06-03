import React, { useState } from "react";
import Navbar from "../navbar";
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
import UserRepolist from "../repository/UserRepolist";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1d1a1acb",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "transparent",
    color: "#ffff",
  }),
}));

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
const CardCarousel = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  minHeight: "100%",
  height: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1d1a1acb",
  borderRadius: "8px",
  padding: "16px 12px",
  overflow: "hidden",
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    minHeight: "120px",
    padding: "12px 8px",
  },
}));

const CardContainer = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

const CardWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#2d2a2a3f",
  borderRadius: "1rem",
  padding: "16px",
  flexDirection: "column",
  gap: "8px",
  boxSizing: "border-box",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "12px",
  },
}));

const NavigationButton = styled("button")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "none",
  color: "#ffffff",
  cursor: "pointer",
  padding: "10px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  transition: "all 0.3s ease",
  minWidth: "44px",
  minHeight: "44px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  "&:active": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px",
    minWidth: "36px",
    minHeight: "36px",
  },
}));

const LeftButton = styled(NavigationButton)({
  left: "8px",
});

const RightButton = styled(NavigationButton)({
  right: "8px",
});
function Dashboard() {
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1,
    );
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
                  style={{ backgroundColor: "transparent" }}>
                  <Avatar {...stringAvatar(localStorage.getItem("userName"))} />
                </Stack>
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
              {/* <div className="Option">
                  <PriorityHighRoundedIcon />
                </div> */}
            </div>
          </div>
        </div>
        <div className="grid">
          <div className="Grid">
            <Grid container spacing={2}>
              <Grid size={3}>
                <UserRepolist />
              </Grid>
              <Grid size={6} className="scroll">
                <p>Suggested Repositories</p>
                <Carousel />
              </Grid>
              <Grid size={3}>
                <Help />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
