module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true, // ✅ this must go inside the preset array
        },
      ],
    ],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          allowlist: [
            'EXPO_PUBLIC_API_BASE',
            'EXPO_PUBLIC_API_STAGING_BASE',
            'EXPO_PUBLIC_API_ORIGIN', 
            'EXPO_PUBLIC_API_USER_AGENT',
            'EXPO_PUBLIC_API_AUTHORIZATION',
            'EXPO_PUBLIC_URL_DEVELOPMENT',
            'EXPO_PUBLIC_URL_PRODUCTION',
            'EXPO_PUBLIC_AUTH_SECRET',
            'EXPO_PUBLIC_MONGODB_PASSWORD',
            'EXPO_PUBLIC_UPSTASH_REDIS_REST_URL',
            'EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN',
            'EXPO_PUBLIC_APPWRITE_CLIENT_ID',
            'EXPO_PUBLIC_APPWRITE_BUCKET_ID',
            'EXPO_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID',
            'EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID',
            'EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID',
            'EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID',
            'EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID',
            'EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID',
            'EXPO_PUBLIC_APPWRITE_UPLOAD_KEY',
            'EXPO_PUBLIC_GMAIL_ADDRESS',
            'EXPO_PUBLIC_GMAIL_APP_PASS',
            'EXPO_PUBLIC_RESEND_API_KEY',
            'EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY',
            'EXPO_PUBLIC_FLW_TEST_SECRET_KEY',
            'EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY',
            'EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID',
            'EXPO_PUBLIC_FLW_SECRET_HASH',
            'EXPO_PUBLIC_STRIPE_SK',
            'EXPO_PUBLIC_STRIPE_PK',
            'EXPO_PUBLIC_DEEPLINK_DEVELOPMENT',
            'EXPO_PUBLIC_ENV',
            'EXPO_PUBLIC_SENDGRID_API_KEY'
          ],
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
