export { getApiHeaders } from "../utils/apiHeaders";

const getConfiguredApiUrl = () => {
  const rawUrl =
    process.env.EXPO_PUBLIC_ENV === "production"
      ? process.env.EXPO_PUBLIC_API_BASE
      : process.env.EXPO_PUBLIC_API_STAGING_BASE;

  const normalized = rawUrl?.trim() ?? "";
  if (!normalized) return "";

  // Guard against invalid runtime values (e.g. blob: URIs).
  if (!/^https?:\/\//i.test(normalized)) {
    console.warn("Invalid API base URL detected. Expected http(s) URL.");
    return "";
  }

  return normalized.replace(/\/+$/, "");
};

export const apiUrl = getConfiguredApiUrl();
