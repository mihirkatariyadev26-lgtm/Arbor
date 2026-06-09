import { useParams } from "react-router-dom";
import RepositoryViewer from "./RepoTree";
import React, { useState, useEffect } from "react";
import axios from "axios";

function RepoPage() {
  const { id: repoId } = useParams();
  const [commitId, setCommitId] = useState(undefined);
  const [userId, setUserId] = useState(undefined);

  const fetchCommitId = async (id) => {
    try {
      const result = await axios.get(
        `https://arbor-backend-qr7t.onrender.com/repo/${id}`,
      );
      // The backend uses .find() which returns an array. We take the first element.
      const repo = result.data[0];
      if (repo && repo.commits && repo.commits.length > 0) {
        // The latest commit is the last object pushed to the commits array
        const latestCommitId =
          repo.commits[repo.commits.length - 1].latestCommit;
        setCommitId(latestCommitId);
        console.log("Fetched commitId:", latestCommitId);
        setUserId(result.data.owner._id);
      } else {
        setCommitId(null); // explicitly set to null when no commits are found
      }
    } catch (e) {
      console.log("error while getting CommitId", e);
      setCommitId(null);
    }
  };

  useEffect(() => {
    if (repoId) {
      fetchCommitId(repoId);
    }
  }, [repoId]);

  return (
    <div>
      <RepositoryViewer userId={userId} repoId={repoId} commitId={commitId} />
    </div>
  );
}

export default RepoPage;
