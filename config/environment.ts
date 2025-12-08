import Constants from "expo-constants";
import type { EnvironmentConfig } from "../types/environment";

const validateEnvironmentVariables = () => {
  const requiredEnvVars = {
    EXPO_PUBLIC_URL_DEVELOPMENT: process.env.EXPO_PUBLIC_URL_DEVELOPMENT,
    EXPO_PUBLIC_URL_PRODUCTION: process.env.EXPO_PUBLIC_URL_PRODUCTION,
    EXPO_PUBLIC_API_BASE: process.env.EXPO_PUBLIC_API_BASE,
    EXPO_PUBLIC_API_STAGING_BASE: process.env.EXPO_PUBLIC_API_STAGING_BASE,
    EXPO_PUBLIC_AUTH_SECRET: process.env.EXPO_PUBLIC_AUTH_SECRET,
    EXPO_PUBLIC_MONGODB_PASSWORD: process.env.EXPO_PUBLIC_MONGODB_PASSWORD,
    EXPO_PUBLIC_UPSTASH_REDIS_REST_URL:
      process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL,
    EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN:
      process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
    EXPO_PUBLIC_APPWRITE_CLIENT_ID: process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID,
    EXPO_PUBLIC_APPWRITE_BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    EXPO_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID:
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID,
    EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID:
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID,
    EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID:
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID,
    EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID:
      process.env.EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID,
    EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID:
      process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
    EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID:
      process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID,
    EXPO_PUBLIC_APPWRITE_UPLOAD_KEY:
      process.env.EXPO_PUBLIC_APPWRITE_UPLOAD_KEY,
    EXPO_PUBLIC_GMAIL_ADDRESS: process.env.EXPO_PUBLIC_GMAIL_ADDRESS,
    EXPO_PUBLIC_GMAIL_APP_PASS: process.env.EXPO_PUBLIC_GMAIL_APP_PASS,
    EXPO_PUBLIC_RESEND_API_KEY: process.env.EXPO_PUBLIC_RESEND_API_KEY,
    EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY:
      process.env.EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY,
    EXPO_PUBLIC_FLW_TEST_SECRET_KEY:
      process.env.EXPO_PUBLIC_FLW_TEST_SECRET_KEY,
    EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY:
      process.env.EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY,
    EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID:
      process.env.EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID,
    EXPO_PUBLIC_FLW_SECRET_HASH: process.env.EXPO_PUBLIC_FLW_SECRET_HASH,
    EXPO_PUBLIC_STRIPE_SK: process.env.EXPO_PUBLIC_STRIPE_SK,
    EXPO_PUBLIC_STRIPE_PK: process.env.EXPO_PUBLIC_STRIPE_PK,
    EXPO_PUBLIC_DEEPLINK_DEVELOPMENT:
      process.env.EXPO_PUBLIC_DEEPLINK_DEVELOPMENT,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n\n` +
        "See .env.example for reference."
    );
  }
};

try {
  validateEnvironmentVariables();
} catch (error) {
  console.error(
    "Environment configuration error: Missing required environment variables"
  );
  throw error;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const currentEnv =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_ENV || "development";

  return {
    urlDevelopment: process.env.EXPO_PUBLIC_URL_DEVELOPMENT!,
    urlProduction: process.env.EXPO_PUBLIC_URL_PRODUCTION!,
    apiBase: process.env.EXPO_PUBLIC_API_BASE!,
    apiStagingBase: process.env.EXPO_PUBLIC_API_STAGING_BASE!,
    authSecret: process.env.EXPO_PUBLIC_AUTH_SECRET!,
    mongodbPassword: process.env.EXPO_PUBLIC_MONGODB_PASSWORD!,
    upstashRedisRestUrl: process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL!,
    upstashRedisRestToken: process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
    appwriteClientId: process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID!,
    appwriteBucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
    appwriteEditorialBucketId:
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID!,
    appwriteEditorialDatabaseId:
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID!,
    appwriteEditorialCollectionId:
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID!,
    appwritePromotionalBucketId:
      process.env.EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID!,
    appwriteLogoBucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
    appwriteDocumentationBucketId:
      process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
    appwriteUploadKey: process.env.EXPO_PUBLIC_APPWRITE_UPLOAD_KEY!,
    gmailAddress: process.env.EXPO_PUBLIC_GMAIL_ADDRESS!,
    gmailAppPass: process.env.EXPO_PUBLIC_GMAIL_APP_PASS!,
    resendApiKey: process.env.EXPO_PUBLIC_RESEND_API_KEY!,
    flwTestPublicKey: process.env.EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY!,
    flwTestSecretKey: process.env.EXPO_PUBLIC_FLW_TEST_SECRET_KEY!,
    flwTestEncryptionKey: process.env.EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY!,
    flwPaymentPlanId: process.env.EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID!,
    flwSecretHash: process.env.EXPO_PUBLIC_FLW_SECRET_HASH!,
    stripeSecretKey: process.env.EXPO_PUBLIC_STRIPE_SK!,
    stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PK!,
    deeplinkDevelopment: process.env.EXPO_PUBLIC_DEEPLINK_DEVELOPMENT!,
    environment: currentEnv,
  };
};

export const envConfig = getEnvironmentConfig();
