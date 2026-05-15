const REDIRECT_HOST_STAGING = "staging.redirect.omenai.app";
const REDIRECT_HOST_PRODUCTION = "redirect.omenai.app";

const ASSOCIATED_DOMAIN_STAGING = `applinks:${REDIRECT_HOST_STAGING}`;
const ASSOCIATED_DOMAIN_PRODUCTION = `applinks:${REDIRECT_HOST_PRODUCTION}`;


function isProductionEnv() {
  return (process.env.EXPO_PUBLIC_ENV === "production");
}

function getDeepLinkRedirectHost() {
  return isProductionEnv() ? REDIRECT_HOST_PRODUCTION : REDIRECT_HOST_STAGING;
}

function getAssociatedDomainsIOS() {
  return isProductionEnv() ? [ASSOCIATED_DOMAIN_PRODUCTION] : [ASSOCIATED_DOMAIN_STAGING];
}

module.exports = {
  REDIRECT_HOST_STAGING,
  REDIRECT_HOST_PRODUCTION,
  isProductionEnv,
  getDeepLinkRedirectHost,
  getAssociatedDomainsIOS,
};
