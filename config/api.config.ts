import {
  EXPO_PUBLIC_URL_DEVELOPMENT,
  EXPO_PUBLIC_URL_PRODUCTION,
  EXPO_PUBLIC_API_ORIGIN,
  EXPO_PUBLIC_API_USER_AGENT,
  EXPO_PUBLIC_API_AUTHORIZATION,
  EXPO_PUBLIC_ENV,
} from "@env";

const getApiUrl = () => {
  return EXPO_PUBLIC_ENV === "development"
    ? EXPO_PUBLIC_URL_DEVELOPMENT
    : EXPO_PUBLIC_URL_PRODUCTION;
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
