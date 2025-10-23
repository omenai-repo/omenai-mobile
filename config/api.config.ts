import { EXPO_PUBLIC_API_BASE, EXPO_PUBLIC_API_ORIGIN, EXPO_PUBLIC_API_USER_AGENT, EXPO_PUBLIC_API_AUTHORIZATION } from '@env';

const validateEnvironmentVariables = () => {
  const requiredEnvVars = {
    EXPO_PUBLIC_API_BASE,
    EXPO_PUBLIC_API_ORIGIN,
    EXPO_PUBLIC_API_USER_AGENT,
    EXPO_PUBLIC_API_AUTHORIZATION,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n\n` +
      'See .env.example for reference.'
    );
  }
};

try {
  validateEnvironmentVariables();
} catch (error) {
  console.error('Environment configuration error: Missing required environment variables');
  throw error;
}

export const apiConfig = {
  baseUrl: EXPO_PUBLIC_API_BASE,
  origin: EXPO_PUBLIC_API_ORIGIN,
  userAgent: EXPO_PUBLIC_API_USER_AGENT,
  authorization: EXPO_PUBLIC_API_AUTHORIZATION,
} as const;

export const apiUrl = apiConfig.baseUrl;
export const originHeader = apiConfig.origin;
export const userAgent = apiConfig.userAgent;
export const authorization = apiConfig.authorization;
