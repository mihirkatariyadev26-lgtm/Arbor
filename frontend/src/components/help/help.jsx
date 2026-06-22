import React from "react";
import "./help.css";
import Navbar from "../Navbar.jsx";

function Help() {
  return (
    <div className="docs-page">
      <Navbar />
      <main className="docs-content">
        <div className="docs-container">
          <h1 className="docs-header">Documentation</h1>
          <ul className="docs-list">
            <li className="step">
              <strong>arbor init</strong>
              <div className="step-desc">
                Usage: Initialise a new repository
              </div>
            </li>
            <li className="step">
              <strong>arbor login</strong>
              <div className="step-desc">Usage: Login to remote Account</div>
            </li>
            <li className="step">
              <strong>arbor link &lt;URL&gt;</strong>
              <div className="step-desc">
                Usage: Link remote repository to local repository
              </div>
            </li>
            <li className="step">
              <strong>arbor add &lt;file&gt;</strong>
              <div className="step-desc">
                Usage: Add &lt;file&gt; to repository
              </div>
            </li>
            <li className="step">
              <strong>arbor add .</strong>
              <div className="step-desc">
                Usage: Add all changes (files) to repository
              </div>
            </li>
            <li className="step">
              <strong>arbor commit &lt;Message&gt;</strong>
              <div className="step-desc">Usage: Commit to the repository</div>
            </li>
            <li className="step">
              <strong>arbor revert &lt;commitId&gt;</strong>
              <div className="step-desc">Usage: Revert to previous changes</div>
            </li>
            <li className="step">
              <strong>arbor push</strong>
              <div className="step-desc">Usage: Push to the repository</div>
            </li>
            <li className="step">
              <strong>arbor pull</strong>
              <div className="step-desc">Usage: Pull the repository</div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Help;
