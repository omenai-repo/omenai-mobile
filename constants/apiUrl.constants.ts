export { getApiHeaders } from "#utils/network/apiHeaders";

/** Linear-time; avoids regex backtracking on long slash runs */
function stripTrailingSlashes(url: string): string {
  let end = url.length;
  while (end > 0 && url[end - 1] === "/") {
    end -= 1;
  }
  return end === url.length ? url : url.slice(0, end);
}

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

  return stripTrailingSlashes(normalized);
};

export const apiUrl = getConfiguredApiUrl();
