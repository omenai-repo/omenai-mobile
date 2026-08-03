/** Subtitles for AuthHeader — aligned with Collector / Artist / Gallery tabs */
export const LOGIN_SUBTITLES = [
  "Access your account to browse and purchase artwork on Omenai.",
  "Access your account to manage artworks, orders, and wallet.",
  "Access your account to manage listings, subscriptions, and orders.",
] as const;

export function getLoginSubtitle(tabIndex: number): string {
  if (tabIndex < 0 || tabIndex >= LOGIN_SUBTITLES.length) {
    return LOGIN_SUBTITLES[0];
  }
  return LOGIN_SUBTITLES[tabIndex];
}
