import fs from "fs/promises";
import path from "path";

// Helper to read and parse the .arborignore file
async function loadIgnoreRules(projectRoot) {
  const defaultIgnores = [
    ".Arbor",
    "node_modules",
    ".env",
    ".git",
    ".DS_Store",
  ];
  const ignoreFilePath = path.join(projectRoot, ".arborignore");

  try {
    const content = await fs.readFile(ignoreFilePath, "utf-8");
    const userRules = content
      .split(/\r?\n/) // Split by newlines
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")); // Skip empty lines and comments

    // Combine defaults with user rules, ensuring uniqueness
    return Array.from(new Set([...defaultIgnores, ...userRules]));
  } catch {
    // If .arborignore doesn't exist, gracefully fall back to defaults
    return defaultIgnores;
  }
}

// Helper to check if a file or folder path matches any ignore rules
function isIgnored(absolutePath, projectRoot, ignoreRules) {
  const relativePath = path
    .relative(projectRoot, absolutePath)
    .replace(/\\/g, "/");
  const pathParts = relativePath.split("/");

  return ignoreRules.some((rule) => {
    // Clean up the rule for standard matching
    const cleanRule = rule.replace(/^\/|\/$/g, "");

    // Match if any part of the directory tree matches the rule (e.g., node_modules)
    // Or if the full relative path matches or starts with the rule
    return (
      pathParts.includes(cleanRule) ||
      relativePath === cleanRule ||
      relativePath.startsWith(cleanRule + "/")
    );
  });
}

// Recursive directory walker that respects ignore rules
async function getFilesRecursively(dir, projectRoot, ignoreRules) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);

      // Instantly drop files/folders matching ignore rules
      if (isIgnored(res, projectRoot, ignoreRules)) {
        return [];
      }

      return entry.isDirectory()
        ? getFilesRecursively(res, projectRoot, ignoreRules)
        : res;
    }),
  );

  return files.flat();
}

export async function addRepo(filePath) {
  const projectRoot = process.cwd();
  const repoPath = path.resolve(projectRoot, ".Arbor");
  const stagingPath = path.join(repoPath, ".Staging");

  try {
    const absoluteTargetPath = path.resolve(projectRoot, filePath);

    try {
      await fs.access(absoluteTargetPath);
    } catch {
      console.error(`Error: Path "${filePath}" does not exist.`);
      return;
    }

    // Load up all active ignore patterns
    const ignoreRules = await loadIgnoreRules(projectRoot);

    // Guard rail: If the target input itself is ignored, exit early
    if (isIgnored(absoluteTargetPath, projectRoot, ignoreRules)) {
      console.log(
        `Notice: Path "${filePath}" is ignored by your configuration rules.`,
      );
      return;
    }

    const stat = await fs.stat(absoluteTargetPath);
    let filesToAdd = [];

    if (stat.isDirectory()) {
      filesToAdd = await getFilesRecursively(
        absoluteTargetPath,
        projectRoot,
        ignoreRules,
      );
    } else {
      filesToAdd = [absoluteTargetPath];
    }

    if (filesToAdd.length === 0) {
      console.log("No untracked changes to stage.");
      return;
    }

    // Safely execute staging copies
    for (const absoluteFilePath of filesToAdd) {
      const relativePath = path.relative(projectRoot, absoluteFilePath);
      const destPath = path.join(stagingPath, relativePath);

      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.copyFile(absoluteFilePath, destPath);
    }

    console.log(`Success: Staged ${filesToAdd.length} file(s) for commit.`);
  } catch (error) {
    console.error("Error during staging process:", error.message);
  }
}
