import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return 0;
  const result = dotenv.config({ path: envPath, override: false });
  return result.parsed ? Object.keys(result.parsed).length : 0;
}

const cwd = process.cwd();
const envPaths = [
  path.resolve(cwd, ".env"),
  path.resolve(cwd, "Backend", ".env"),
  path.resolve(cwd, "backend", ".env"),
  path.resolve(__dirname, "../.env"),
];

for (const envPath of envPaths) {
  loadEnvFile(envPath);
}
