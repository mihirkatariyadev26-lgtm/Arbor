import { React, useState } from "react";
import Navbar from "../Navbar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
function CreateIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const handleCreateIssue = async () => {
    const res = await axios.post(
      `https://arbor-backend-qr7t.onrender.com/issue/create/${id}`,
      {
        title: title,
        description: description,
        owner: localStorage.getItem("userId"),
        ownerName: localStorage.getItem("userName"),
      },
    );
    console.log(res);
    navigate(`/repo/${id}`);
  };
  return (
    <div className="Repoform">
      <Navbar />
      <div className="content">
        <Box className="form">
          <h3>Create Issue</h3>
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
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          <div className="btn" type="button" onClick={handleCreateIssue}>
            Create Issue
          </div>
          <p>Please enter the Data</p>
        </Box>
      </div>
    </div>
  );
}

export default CreateIssue;
