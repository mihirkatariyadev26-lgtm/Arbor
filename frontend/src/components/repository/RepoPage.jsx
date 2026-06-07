import { useParams } from "react-router-dom";
import RepositoryViewer from "./RepoTree";
import React from "react";

function RepoPage() {
  const commitId = "448000b1-0f14-43e7-a632-0df10ea15f30";
  const repoId = "69d680774966b725c09d590b";
  const userId = "69ed2a55e14ad0da0e270eb8";
  return (
    <div>
      <RepositoryViewer userId={userId} repoId={repoId} commitId={commitId} />
    </div>
  );
}

export default RepoPage;
