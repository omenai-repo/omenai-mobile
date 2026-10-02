import * as Linking from "expo-linking";

/** Parses `token` from a deep-link URL; trims and decodes once when encoded. */
export function extractDeepLinkToken(url: string): string {
  const raw = Linking.parse(url).queryParams?.token;
  if (typeof raw !== "string") return "";

  let token = raw.trim();
  if (!token) return "";

  try {
    const decoded = decodeURIComponent(token).trim();
    if (decoded) token = decoded;
  } catch {
    // Keep trimmed raw token when decode fails.
  }

  return token;
}
