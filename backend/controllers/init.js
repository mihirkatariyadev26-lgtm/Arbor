import fs from "fs/promises";
import path from "path";
import os from "node:os";
import { exec } from "node:child_process";

export async function initRepo() {
  const system = os.platform();
  const repoPath = path.resolve(process.cwd(), ".Arbor");
  const commitPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({}, null, 2),
    );
    await fs.writeFile(path.join(repoPath, "HEAD"), "");

    if (system === "win32") {
      exec(`attrib +h ${".Arbor"}`, (err) => {
        if (!err) console.log("hidden folder created successfully");
      });
    }
    console.log("Repository is created");
  } catch (e) {
    console.error(e);
  }
}
