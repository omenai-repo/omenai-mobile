const isProduction = process.env.EXPO_PUBLIC_ENV === "production";

export const DEEP_LINK_REDIRECT_HOST = isProduction
  ? "redirect.omenai.app"
  : "staging.redirect.omenai.app";

export const DEEP_LINK_REDIRECT_ORIGIN = `https://${DEEP_LINK_REDIRECT_HOST}`;

export const DEEP_LINK_ASSOCIATED_DOMAIN = `applinks:${DEEP_LINK_REDIRECT_HOST}`;

/** Marketing web host — keep in sync with constants/deepLinkHost.constants.js */
export const WEB_HOST = isProduction ? "omenai.app" : "staging.omenai.app";

export const WEB_ORIGIN = `https://${WEB_HOST}`;
