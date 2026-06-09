import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useParams } from "react-router-dom";
function IssueEditPage() {
  const { issueId } = useParams();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/issue/${issueId}`,
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (e) {
        console.log(e);
      }
    };
    fetchIssue();
  }, []);

  return (
    <div className="Repoform">
      <Navbar />
      <div className="content">
        <Box className="form">
          <h3>Edit Issue</h3>
          <div className="field">
            <TextField
              required
              id="filled-basic"
              label="Title"
              variant="filled"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
            />
          </div>
          <div className="field">
            <TextField
              required
              id="filled-basic"
              label="Description"
              variant="filled"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
          </div>

          <div className="btn" type="button">
            Edit Issue
          </div>
          <p>Please enter the Data</p>
        </Box>
      </div>
    </div>
  );
}

export default IssueEditPage;
