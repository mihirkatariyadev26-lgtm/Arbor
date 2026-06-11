import axios from "axios";
import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE, NO_CACHE_HEADERS } from "../../config/api";
import "./IssueNav.css";
import ListIcon from "@mui/icons-material/List";
import DataSaverOnOutlinedIcon from "@mui/icons-material/DataSaverOnOutlined";
function IssueNav() {
  const [repo, setRepo] = useState({});
  const [count, setCount] = useState(0);
  const [owner, setOwner] = useState(undefined);
  const navigate = useNavigate();
  const { id: repoId } = useParams();
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    const repoData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/repo/${repoId}`, {
          headers: NO_CACHE_HEADERS,
        });
        const repo = Array.isArray(response.data) ? response.data[0] : null;
        if (!repo) return;
        setOwner(repo.owner._id);
        setCount(repo.issues?.length || 0);
        setRepo(repo);
      } catch (e) {
        console.log("Error while fetching data", e);
      }
    };
    if (repoId) repoData();
  }, [repoId]);
  const linkCopy = () => {
    setIsClicked(true);
    navigator.clipboard.writeText(window.location.href);
    console.log("copied");
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };
  return (
    <div
      style={{
        height: "8vh",
        width: "97%",
        display: "flex",
        alignItem: "center",
        justifyContent: "space-between",
        backgroundColor: " rgba(0, 0, 0, 0.656)",
        margin: "1rem",
        marginRight: "1rem",
        borderRadius: "2rem",
        boxShadow: "0vh 0vh 1vh rgba(255, 255, 255, 0.511)",
      }}>
      {/* left section */}
      <div
        className="name-repo"
        onClick={() => {
          navigate(`/repo/${repoId}`);
        }}>
        {repo.name}
      </div>
      {/* right Part */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "2rem",
          marginRight: "1.05rem",
          backgroundColor: "transparent",
        }}>
        {isClicked ? <p style={{ fontSize: "1.25rem" }}>Copied!!</p> : ""}
        {owner === localStorage.getItem("userId") ? (
          <div
            id="link"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.21)",
              paddingBlock: "1rem",
              paddingInline: "1.5rem",
              borderRadius: "2rem",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.21)";
              e.currentTarget.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.cursor = "arrow";
            }}
            onClick={() => {
              linkCopy();
            }}>
            Link : {window.location.href}
          </div>
        ) : (
          ""
        )}

        <div
          style={{
            alignContent: "center",
            fontSize: "1.25rem",
          }}>
          Issues:{count}
        </div>
        {/*Issue Count */}
        <div
          style={{
            backgroundColor: "transparent",
            paddingInline: "1.5rem",
            paddingBlock: "0.75rem",
            borderRadius: "2rem",
            fontSize: "1.15rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "forestgreen")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={() => navigate(`/repo/${repoId}/issue/show`)}>
          <ListIcon />
          All Issues
        </div>
        {/*create issue btn */}
        <div
          style={{
            backgroundColor: "transparent",
            paddingInline: "1.5rem",
            paddingBlock: "0.75rem",
            borderRadius: "2rem",
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
            fontSize: "1.15rem",
            alignContent: "center",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "forestgreen")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={() => {
            navigate(`/repo/${repoId}/issue/create`);
          }}>
          <DataSaverOnOutlinedIcon />
          New Issue
        </div>
        {/*All issue btn */}
      </div>
    </div>
  );
}

export default IssueNav;
