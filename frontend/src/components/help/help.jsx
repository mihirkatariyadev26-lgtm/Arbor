import React from "react";
import "./help.css";
function Help() {
  return (
    <ul
      className="list"
      style={{
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}>
      <p className="header">Guide to use Application</p>
      <li className="step">
        arbor init <br />
        Usage: Initalise a new repository
      </li>
      <li className="step">
        arbor login <br />
        Usage: Login to remote Account
      </li>
      <li className="step">
        arbor link {"<URL>"} <br />
        Usage: Link Remote Repository to local Repository
      </li>

      <li className="step">
        arbor add {"<file>"} <br />
        Usage: Add {"<file>"} to repository <br />
        or
      </li>
      <li className="step">
        arbor add . <br />
        Usage: Add all changes{`(files)`} to repository <br />
        or
      </li>
      <li className="step">
        arbor commit {"<Message>"} <br />
        Usage: Commit to the repository
      </li>
      <li className="step">
        arbor revert {"<commitId>"} <br />
        Usage: Revert to the old changes
      </li>
      <li className="step">
        arbor push <br />
        Usage: Push to the repository
      </li>
      <li className="step">
        arbor pull <br />
        Usage: Pull the repository
      </li>
    </ul>
  );
}

export default Help;
