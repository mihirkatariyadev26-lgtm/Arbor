import React, { useState } from "react";
import Navbar from "../Navbar.jsx";
import "./CreateRepo.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRepo() {
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(null);
  const [valid, setValid] = useState(true);
  const [content, setContent] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleVisibility = (e) => {
    setVisibility(e.target.value === "Public");
  };
  const handleCreate = async () => {
    try {
      if (isSubmitting) return;
      if (repoName && description && visibility !== null) {
        setIsSubmitting(true);

        //TODO:write the api call for create repo
        const res = await axios.post("http://localhost:3000/repo/create", {
          name: repoName,
          description: description,
          visibility: visibility,
          owner: localStorage.getItem("userId"),
          content: [content],
          issues: [],
        });
        setValid(true);
        navigate("/dashboard");
      } else {
        //TODO:return the validation error
        setValid(false);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.log("Error Occured in Creating the repository", e);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="Repoform">
      <Navbar />
      <div className="content">
        <Box className="form">
          <h3>Create Repository</h3>
          <div className="field">
            <TextField
              required
              id="filled-basic"
              label="Repository Name"
              variant="filled"
              onChange={(e) => {
                setRepoName(e.target.value);
              }}
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
            />
          </div>
          <div className="field">
            <TextField
              required
              id="filled-basic"
              label="Content"
              variant="filled"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </div>
          <div className="visibility ">
            Visibility :
            <div className="toggle">
              <input
                type="radio"
                id="Public"
                name="visibility"
                value="Public"
                checked={visibility === true}
                onChange={handleVisibility}
              />
              <label htmlFor="Public"> Public </label>
            </div>
            <div className="toggle" required>
              <input
                type="radio"
                id="Private"
                name="visibility"
                value="Private"
                checked={visibility === false}
                onChange={handleVisibility}
              />
              <label htmlFor="Private">Private</label>
            </div>
          </div>

          <div className="btn" type="button" onClick={handleCreate}>
            Creat Repository
          </div>
          {valid ? "" : <p>Please enter the Data</p>}
        </Box>
      </div>
    </div>
  );
}

export default CreateRepo;
