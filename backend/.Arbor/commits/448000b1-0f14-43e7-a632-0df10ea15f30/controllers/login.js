import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import path from "path";
import fs from "fs/promises";

export async function login() {
  const rl = readline.createInterface({ input, output });

  try {
    // 1. Prompt user for credentials
    const email = await rl.question("Enter your email: ");
    const password = await rl.question("Enter your password: ");
    rl.close();

    // 2. Authenticate against your local backend
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `❌ Login failed: ${data.message || "Invalid credentials"}`,
      );
      return;
    }

    const { userId } = data;
    if (!userId) {
      console.error("❌ Login failed: Backend did not return a userId.");
      return;
    }

    // 3. Locate your local .Arbor/config.json file
    const repoPath = path.resolve(process.cwd(), ".Arbor");
    const configPath = path.join(repoPath, "config.json");

    // Make sure the .Arbor directory exists just in case
    await fs.mkdir(repoPath, { recursive: true });

    // Read the existing config data so we don't wipe out the repoId
    let configData = {};
    try {
      const existingContent = await fs.readFile(configPath, "utf-8");
      configData = JSON.parse(existingContent);
    } catch (readError) {
      // File doesn't exist yet, which is fine; we will build a new one
    }

    // Merge the new userId into the file
    configData.userId = userId;

    // Write the updated object back to .Arbor/config.json
    await fs.writeFile(configPath, JSON.stringify(configData, null, 2));

    console.log("Login successful! Your userId has been saved to Arbor");
  } catch (error) {
    console.error("❌ An error occurred during login:", error.message);
    rl.close();
  }
}
