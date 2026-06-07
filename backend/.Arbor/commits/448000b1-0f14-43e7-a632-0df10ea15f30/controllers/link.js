import fs from "fs/promises";
import path from "path";

export async function linkRepo(url) {
  if (!url) {
    console.error("❌ Error: Please provide a repository URL.");
    return;
  }

  try {
    // 1. Clean up the URL and extract the Repo ID (the last segment of the path)
    const cleanUrl = url.trim().replace(/\/$/, ""); // Remove trailing slash if any
    const repoId = cleanUrl.split("/").pop(); // Grabs the last part of the URL

    if (!repoId || repoId.includes("http")) {
      console.error("❌ Error: Invalid URL format. Could not extract Repo ID.");
      return;
    }

    // 2. Locate your local .Arbor/config.json file
    const repoPath = path.resolve(process.cwd(), ".Arbor");
    const configPath = path.join(repoPath, "config.json");

    // Ensure directory exists
    await fs.mkdir(repoPath, { recursive: true });

    // 3. Read existing data so we don't overwrite the userId
    let configData = {};
    try {
      const existingContent = await fs.readFile(configPath, "utf-8");
      configData = JSON.parse(existingContent);
    } catch (readError) {
      // File doesn't exist yet or is empty, which is fine
    }

    // 4. Add the repoId and originUrl to the config object
    configData.repoId = repoId;
    configData.originUrl = cleanUrl;

    // 5. Write the combined data back to config.json
    await fs.writeFile(configPath, JSON.stringify(configData, null, 2));

    console.log(`✅ Successfully linked repository!`);
    console.log(`📦 Repo ID Extracted: ${repoId}`);
  } catch (error) {
    console.error(
      "❌ An error occurred while linking the repository:",
      error.message,
    );
  }
}
