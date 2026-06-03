import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Navbar from "../Navbar";
import "../../components/auth/Login.css";

function EditRepo() {
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { id: repoID } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      if (!repoID) return;
      try {
        const res = await axios.get(`http://localhost:3000/repo/${repoID}`);
        console.log(res.data);
        setDescription(res.data[0].description || "");
        setContent(res.data[0].content || "");
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [repoID]);

  const handleChange = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3000/repo/update/${repoID}`,
        {
          description: description,
          content: content,
        },
      );
      console.log(res);
      setLoading(false);
      navigate("/Dashboard");
    } catch (e) {
      console.log(e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="auth">
        <Navbar />
        <div className="content">
          <Box className="form">
            <h2>Edit</h2>
            <div className="field">
              <TextField
                id="filled-basic"
                label="Description"
                value={description}
                required
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                variant="filled"
              />
            </div>
            <div className="field">
              <TextField
                id="filled-basic"
                required="true"
                label="Content"
                variant="filled"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </div>
            <div
              className="btn"
              type="button"
              onClick={handleChange}
              disabled={loading}>
              {loading ? "Loading..." : "Edit"}
            </div>
          </Box>
        </div>
      </div>
      <script src="../dashboard/Dashboard.jsx" rel="preload"></script>
    </>
  );
}

export default EditRepo;
