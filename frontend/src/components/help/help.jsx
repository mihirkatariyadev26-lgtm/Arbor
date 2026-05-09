import React from "react";
import "./help.css";
function Help() {
  return (
    <ul className="list">
      <p className="header">Guide to use Application</p>
      <li className="step">
        index.js init <br />
        Usage: Initalise a new repository
      </li>
      <li className="step">
        index.js add {"<file>"} <br />
        Usage: Add file to repository
      </li>
      <li className="step">
        index.js commit {"<Message>"} <br />
        Usage: Commit to the repository
      </li>
      <li className="step">
        index.js revert {"<commitId>"} <br />
        Usage: Revert to the old changes
      </li>
      <li className="step">
        index.js push <br />
        Usage: Push to the repository
      </li>
      <li className="step">
        index.js pull <br />
        Usage: Pull the repository
      </li>
    </ul>
  );
}

export default Help;
