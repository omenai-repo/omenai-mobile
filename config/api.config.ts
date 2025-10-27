import {
  EXPO_PUBLIC_ENV,
  EXPO_PUBLIC_API_STAGING_BASE,
  EXPO_PUBLIC_API_BASE,
  EXPO_PUBLIC_API_ORIGIN,
  EXPO_PUBLIC_API_USER_AGENT,
  EXPO_PUBLIC_API_AUTHORIZATION,
} from "@env";

const getApiUrl = () => {
  return EXPO_PUBLIC_ENV === "production"
    ? EXPO_PUBLIC_API_BASE
    : EXPO_PUBLIC_API_STAGING_BASE;
};

export const apiConfig = {
  baseUrl: getApiUrl(),
  origin: EXPO_PUBLIC_API_ORIGIN,
  userAgent: EXPO_PUBLIC_API_USER_AGENT,
  authorization: EXPO_PUBLIC_API_AUTHORIZATION,
} as const;

export const apiUrl = apiConfig.baseUrl;
export const originHeader = apiConfig.origin;
export const userAgent = apiConfig.userAgent;
export const authorization = apiConfig.authorization;
