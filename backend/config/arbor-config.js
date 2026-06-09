import fs from "fs/promises";
import path from "path";
import { getApiUrl } from "./constants.js";

export async function readArborConfig() {
  const configPath = path.resolve(process.cwd(), ".Arbor", "config.json");
  const content = await fs.readFile(configPath, "utf-8");
  return JSON.parse(content);
}

export function apiHeaders(config, extra = {}) {
  const headers = { ...extra };
  if (config?.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }
  return headers;
}

export async function requireLinkedConfig() {
  let config;
  try {
    config = await readArborConfig();
  } catch {
    console.error(
      "❌ Error: config.json not found. Run arbor login and arbor link first.",
    );
    return null;
  }

  if (!config.userId) {
    console.error("❌ Error: userId not found. Run arbor login first.");
    return null;
  }

  if (!config.repoId) {
    console.error("❌ Error: repoId not found. Run arbor link <url> first.");
    return null;
  }

  if (!config.token) {
    console.error(
      "❌ Error: session token missing. Run arbor login again to refresh your session.",
    );
    return null;
  }

  return config;
}

export { getApiUrl };
