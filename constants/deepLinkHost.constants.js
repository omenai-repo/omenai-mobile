const REDIRECT_HOST_STAGING = "staging.redirect.omenai.app";
const REDIRECT_HOST_PRODUCTION = "redirect.omenai.app";

/** Marketing web app hosts (Smart App Banner / domain association — no /dl routes). */
const WEB_HOST_STAGING = "staging.omenai.app";
const WEB_HOST_PRODUCTION = "omenai.app";

const ASSOCIATED_DOMAIN_REDIRECT_STAGING = `applinks:${REDIRECT_HOST_STAGING}`;
const ASSOCIATED_DOMAIN_REDIRECT_PRODUCTION = `applinks:${REDIRECT_HOST_PRODUCTION}`;
const ASSOCIATED_DOMAIN_WEB_STAGING = `applinks:${WEB_HOST_STAGING}`;
const ASSOCIATED_DOMAIN_WEB_PRODUCTION = `applinks:${WEB_HOST_PRODUCTION}`;

function isProductionEnv() {
  return process.env.EXPO_PUBLIC_ENV === "production";
}

function getDeepLinkRedirectHost() {
  return isProductionEnv() ? REDIRECT_HOST_PRODUCTION : REDIRECT_HOST_STAGING;
}

function getWebHost() {
  return isProductionEnv() ? WEB_HOST_PRODUCTION : WEB_HOST_STAGING;
}

/** Redirect deep links + marketing web hosts for in-browser app banners. */
function getAssociatedDomainsIOS() {
  return isProductionEnv()
    ? [ASSOCIATED_DOMAIN_REDIRECT_PRODUCTION, ASSOCIATED_DOMAIN_WEB_PRODUCTION]
    : [ASSOCIATED_DOMAIN_REDIRECT_STAGING, ASSOCIATED_DOMAIN_WEB_STAGING];
}

function getAndroidIntentFilters() {
  const webHost = getWebHost();

  return [
    {
      action: "VIEW",
      autoVerify: true,
      data: [
        {
          scheme: "https",
          host: getDeepLinkRedirectHost(),
          pathPrefix: "/dl",
        },
      ],
      category: ["BROWSABLE", "DEFAULT"],
    },
    {
      action: "VIEW",
      autoVerify: true,
      data: [
        {
          scheme: "https",
          host: webHost,
        },
      ],
      category: ["BROWSABLE", "DEFAULT"],
    },
  ];
}

module.exports = {
  REDIRECT_HOST_STAGING,
  REDIRECT_HOST_PRODUCTION,
  WEB_HOST_STAGING,
  WEB_HOST_PRODUCTION,
  isProductionEnv,
  getDeepLinkRedirectHost,
  getWebHost,
  getAssociatedDomainsIOS,
  getAndroidIntentFilters,
};
