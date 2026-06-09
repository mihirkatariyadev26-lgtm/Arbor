import axios from "axios";
import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./IssueNav.css";
import ListIcon from "@mui/icons-material/List";
import DataSaverOnOutlinedIcon from "@mui/icons-material/DataSaverOnOutlined";
function IssueNav() {
  const [repo, setRepo] = useState({});
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const { id: repoId } = useParams();
  useEffect(() => {
    const repoData = async () => {
      try {
        const response = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/repo/${repoId}`,
        );
        setCount(response.data[0].issues.length);
        setRepo(response.data[0]);
      } catch (e) {
        console.log("Error while fetching data", e);
      }
    };
    repoData();
  }, []);
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
      <div className="name-repo">{repo.name}</div>
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
