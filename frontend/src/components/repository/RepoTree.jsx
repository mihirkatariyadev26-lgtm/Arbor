import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import IssueNav from "./IssueNav";
// ==========================================
// 1. RECURSIVE FILE NODE COMPONENT
// ==========================================
const FileNode = ({ node, onSelectFile, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div>
      {/* Current Row */}
      <div
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          paddingLeft: `${level * 16 + 8}px`, // Indent based on depth level
          cursor: "pointer",
          color: "#c9d1d9", // GitHub dark mode text color
          fontSize: "14px",
          fontFamily: "monospace",
          userSelect: "none",
          backgroundColor: "transparent",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#21262d")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }>
        {/* Expand/Collapse Arrow */}
        <span
          style={{
            width: "16px",
            display: "inline-block",
            fontSize: "10px",
            color: "#8b949e",
            backgroundColor: "transparent",
          }}>
          {isFolder ? (isOpen ? "▼" : "▶") : ""}
        </span>

        {/* Icon (Folder or File) */}
        <span
          style={{
            marginRight: "8px",
            fontSize: "14px",
            backgroundColor: "transparent",
          }}>
          {isFolder ? "📁" : "📄"}
        </span>

        {/* File/Folder Name */}
        <span style={{ backgroundColor: "transparent" }}>{node.name}</span>
      </div>

      {/* Recursive Children Rendering */}
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((childNode, index) => (
            <FileNode
              key={`${level}-${index}`}
              node={childNode}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. SIDEBAR CONTAINER
// ==========================================
const FileSidebar = ({ treeData, onSelectFile, isLoading }) => {
  return (
    <div
      style={{
        width: "20%",
        height: "70vh",
        backgroundColor: "transparent",
        borderRight: "1px solid #30363d",
        overflowY: "auto",
        paddingTop: "10px",
        overflow: "scroll",
        paddingInline: "0.75rem",
        scrollbarWidth: "none",
      }}>
      <div
        style={{
          padding: "10px 16px",
          color: "#8b949e",
          fontSize: "12px",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}>
        Files
      </div>

      {isLoading ? (
        <div style={{ color: "#8b949e", padding: "16px", fontSize: "14px" }}>
          Loading repository data...
        </div>
      ) : treeData.length === 0 ? (
        <div style={{ color: "#8b949e", padding: "16px", fontSize: "14px" }}>
          No files found in this commit.
        </div>
      ) : (
        treeData.map((rootNode, index) => (
          <FileNode key={index} node={rootNode} onSelectFile={onSelectFile} />
        ))
      )}
    </div>
  );
};

// ==========================================
// 3. MAIN PAGE VIEW
// ==========================================
export default function RepositoryViewer({ userId, repoId, commitId }) {
  const [treeData, setTreeData] = useState([]);
  const [isTreeLoading, setIsTreeLoading] = useState(true);

  // New States for File Content viewing
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  // Fetch the folder structure on initial load
  useEffect(() => {
    if (!userId || !repoId || commitId === undefined) return;

    if (commitId === null) {
      setIsTreeLoading(false);
      setTreeData([]);
      return;
    }

    const fetchTree = async () => {
      setIsTreeLoading(true);
      try {
        const response = await fetch(
          `https://arbor-backend-qr7t.onrender.com/repo/tree/${userId}/${repoId}/${commitId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch tree");

        const data = await response.json();
        setTreeData(data.tree || []);
      } catch (error) {
        console.error("Error fetching repository tree:", error);
      } finally {
        setIsTreeLoading(false);
      }
    };

    fetchTree();
  }, [userId, repoId, commitId]);

  // Handler for when a user clicks a specific file
  const handleFileSelect = async (filePath) => {
    setSelectedFilePath(filePath);
    setIsFileLoading(true);
    setFileError("");
    setFileContent("");

    try {
      // Must use encodeURIComponent to safely pass slashes (e.g., "src/app.js") in the query string
      const url = `https://arbor-backend-qr7t.onrender.com/repo/file/${userId}/${repoId}/${commitId}?path=${encodeURIComponent(filePath)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch file content");
      }

      setFileContent(data.content);
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileError(error.message);
    } finally {
      setIsFileLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          backgroundColor: "#010409",
          color: "#c9d1d9",
          overflow: "hidden", // Changed to hidden so the whole page doesn't scroll
        }}>
        <Navbar />
        <IssueNav repoId={repoId} />
        <div
          style={{
            boxShadow: "0 0 2vh rgba(18, 18, 184, 0.511) ",
            display: "flex",
            height: "70vh",
            backgroundColor: "transparent",
            color: "#c9d1d9",
            width: "95%",
            marginLeft: "2.5%",
            borderRadius: "2rem",
            marginTop: "1.25rem",
            overflow: "hidden", // Keep the outer box clean
          }}>
          <FileSidebar
            treeData={treeData}
            onSelectFile={handleFileSelect}
            isLoading={isTreeLoading}
          />

          {/* Main Content Workspace */}
          <div
            style={{
              flex: 1,
              padding: "20px 40px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}>
            {selectedFilePath ? (
              <>
                {/* File Header */}
                <div
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #30363d",
                    paddingBottom: "10px",
                  }}>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#c9d1d9",
                    }}>
                    {selectedFilePath}
                  </span>
                </div>

                {/* File Content Area */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    overflow: "auto", // Allows scrolling inside the code block only
                    padding: "16px",
                    scrollbarWidth: "thin",
                    boxShadow: "0 0 1vh rgba(255, 255, 255, 0.123)",
                    scrollbarWidth: "none",
                  }}>
                  {isFileLoading ? (
                    <p style={{ color: "#8b949e", fontFamily: "monospace" }}>
                      Loading file content...
                    </p>
                  ) : fileError ? (
                    <p style={{ color: "#f85149", fontFamily: "monospace" }}>
                      Error: {fileError}
                    </p>
                  ) : (
                    <pre
                      style={{
                        margin: 0,
                        color: "#e6edf3",
                        fontFamily: "monospace",
                        fontSize: "1.25rem",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}>
                      {fileContent}
                    </pre>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  color: "#8b949e",
                  marginTop: "100px",
                  textAlign: "center",
                }}>
                <h2>Welcome to Arbor</h2>
                <p>Select a file from the sidebar to view its contents.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
