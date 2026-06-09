export const DEFAULT_API_URL = "https://arbor-backend-qr7t.onrender.com";

export function getApiUrl() {
  const url = (process.env.ARBOR_API_URL || DEFAULT_API_URL).trim();
  return url.replace(/\/$/, "");
}
