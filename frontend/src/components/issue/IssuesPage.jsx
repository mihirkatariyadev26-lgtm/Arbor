import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Navbar from "../Navbar";
import PublicIcon from "@mui/icons-material/Public";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import IssueNav from "../repository/IssueNav";
function IssuesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [repoOwner, setRepoOwner] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRepoOwner = async () => {
      try {
        const request = await axios.get(
          `https://arbor-backend-qr7t.onrender.com//repo/${id}`,
        );
        setRepoOwner(request.data[0].owner._id);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchIssues = async () => {
      try {
        const res = await axios.get(
          `https://arbor-backend-qr7t.onrender.com//issue/repo/${id}`,
        );
        setData(res.data);
      } catch (e) {
        console.log("Error Occured while Fetching the Issues", e);
      }
    };
    fetchRepoOwner();
    fetchIssues();
  }, []);

  const handleDelete = async (issueId) => {
    try {
      const response = await axios.delete(
        `https://arbor-backend-qr7t.onrender.com//issue/delete/${issueId}`,
      );
      setData(response.data);
    } catch (e) {
      console.log("Error occured while deleting the issue", e);
    }
  };
  //TODO:ADD AUTHENTICATION AND MAKE PAGE FOR THE EDIT ISSUE AND IMPLEMENT CLOSE THE ISSUE AND DELETE THE ISSUE
  return (
    <div style={{ height: "100vh" }}>
      <Navbar />
      <IssueNav />
      <div
        style={{
          height: "70vh",
          overflow: "scroll",
          scrollbarWidth: "none",
          marginTop: "1rem",
          backgroundColor: "transparent",
          width: "90%",
          marginLeft: "5%",
          boxShadow: "0 0 1vh rgba(18, 18, 184, 0.511) ",
        }}>
        {data ? (
          data.length > 0 ? (
            data.map((e) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    overflow: "scroll",
                    scrollbarWidth: "none",
                  }}
                  key={e._id}>
                  <div
                    style={{
                      width: "90%",
                      boxShadow: "0 0 1vh rgba(255, 255, 255, 0.511) ",
                      // border: "1px solid white",
                      marginBlock: "1rem",
                      borderRadius: "1rem",
                      paddingInline: "2.5rem",
                      paddingBlock: "1.5rem",
                      height: "fit-content",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }>
                    <div
                      className="name"
                      style={{
                        fontSize: "1.5rem",
                        width: "100%",
                        backgroundColor: "transparent",
                        textWrap: "wrap",
                      }}>
                      Posted By: {e.ownerName}
                      <p
                        className="description"
                        style={{ fontSize: "1.25rem" }}>
                        Title: {e.title}
                      </p>
                      <p
                        className="description"
                        style={{ fontSize: "1.25rem" }}>
                        Description: <br /> {e.description}
                      </p>
                      <br />
                      <div
                        className="visibility-status"
                        style={{
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                        }}>
                        {e.status == "open" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "transparent",
                            }}>
                            <BugReportOutlinedIcon />
                            <span style={{ backgroundColor: "transparent" }}>
                              Open
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "transparent",
                            }}>
                            <CheckCircleOutlinedIcon />
                            <span style={{ backgroundColor: "transparent" }}>
                              close
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {e.owner === localStorage.getItem("userId") ||
                    repoOwner === localStorage.getItem("userId") ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: "2rem",
                          backgroundColor: "transparent",
                        }}>
                        {e.owner === localStorage.getItem("userId") && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "0.25rem",
                              marginLeft: "2rem",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              paddingInline: "1.5rem",
                              paddingBlock: "0.75rem",
                              borderRadius: "2rem",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "red")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                            onClick={() => {
                              handleDelete(e._id);
                            }}>
                            <DeleteIcon></DeleteIcon>Delete
                          </div>
                        )}
                        {e.owner === localStorage.getItem("userId") && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "0.25rem",
                              //   marginLeft: "2rem",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              paddingInline: "1.5rem",
                              paddingBlock: "0.75rem",
                              borderRadius: "2rem",
                            }}
                            onClick={() => {
                              navigate(`/repo/${id}/issue/edit/${e._id}`);
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "forestgreen")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }>
                            <BorderColorOutlinedIcon />
                            Edit
                          </div>
                        )}
                        {(e.owner === localStorage.getItem("userId") ||
                          repoOwner === localStorage.getItem("userId")) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "0.25rem",
                              //   marginLeft: "2rem",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              paddingInline: "1.5rem",
                              fontSize: "1.05rem",
                              paddingBlock: "0.75rem",
                              borderRadius: "2rem",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "forestgreen")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }>
                            Close
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No Issues are posted yet</p>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default IssuesPage;
