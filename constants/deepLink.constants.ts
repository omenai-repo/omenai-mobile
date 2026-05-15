const isProduction = process.env.EXPO_PUBLIC_ENV === "production";

export const DEEP_LINK_REDIRECT_HOST = isProduction
  ? "redirect.omenai.app"
  : "staging.redirect.omenai.app";

export const DEEP_LINK_REDIRECT_ORIGIN = `https://${DEEP_LINK_REDIRECT_HOST}`;

export const DEEP_LINK_ASSOCIATED_DOMAIN = `applinks:${DEEP_LINK_REDIRECT_HOST}`;
