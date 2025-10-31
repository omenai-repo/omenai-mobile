const getApiUrl = () => {
  const env = process.env.EXPO_PUBLIC_ENV;

  switch (env) {
    case 'production':
      return process.env.EXPO_PUBLIC_API_BASE;
    case 'staging':
      return process.env.EXPO_PUBLIC_API_STAGING_BASE;
  }
};

export const apiConfig = {
  baseUrl: getApiUrl(),
  origin: process.env.EXPO_PUBLIC_API_ORIGIN,
  userAgent: process.env.EXPO_PUBLIC_API_USER_AGENT,
  authorization: process.env.EXPO_PUBLIC_API_AUTHORIZATION,
} as const;

export const apiUrl = apiConfig.baseUrl;
export const originHeader = apiConfig.origin;
export const userAgent = apiConfig.userAgent;
export const authorization = apiConfig.authorization;
