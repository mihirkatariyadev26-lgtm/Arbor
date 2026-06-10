import { useParams } from "react-router-dom";
import RepositoryViewer from "./RepoTree";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE, NO_CACHE_HEADERS } from "../../config/api";

async function resolveLatestCommitId(repo) {
  if (repo?.commits?.length > 0) {
    return repo.commits[repo.commits.length - 1].latestCommit;
  }

  const ownerId = repo?.owner?._id;
  if (!ownerId || !repo?._id) return null;

  try {
    const { data } = await axios.get(
      `${API_BASE}/repo/commits/latest/${ownerId}/${repo._id}`,
      { headers: NO_CACHE_HEADERS },
    );
    return data.latestCommit || null;
  } catch {
    return null;
  }
}

function RepoPage() {
  const { id: repoId } = useParams();
  const [commitId, setCommitId] = useState(undefined);
  const [userId, setUserId] = useState(undefined);

  const fetchCommitId = async (id) => {
    try {
      const result = await axios.get(`${API_BASE}/repo/${id}`, {
        headers: NO_CACHE_HEADERS,
      });

      const repo = Array.isArray(result.data) ? result.data[0] : null;
      if (!repo) {
        setCommitId(null);
        return;
      }

      setUserId(repo.owner?._id);
      const latestCommitId = await resolveLatestCommitId(repo);
      setCommitId(latestCommitId);
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
