export const paymentConfig = {
  flutterwave: {
    testPublicKey: process.env.EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY,
    testSecretKey: process.env.EXPO_PUBLIC_FLW_TEST_SECRET_KEY,
    testEncryptionKey: process.env.EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY,
    paymentPlanId: process.env.EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID,
    secretHash: process.env.EXPO_PUBLIC_FLW_SECRET_HASH,
  },
  stripe: {
    secretKey: process.env.EXPO_PUBLIC_STRIPE_SK,
    publicKey: process.env.EXPO_PUBLIC_STRIPE_PK,
  },
} as const;

export const isTestMode = () => {
  return process.env.EXPO_PUBLIC_ENV !== "production";
};

export const getPaymentGateway = () => {
  return process.env.EXPO_PUBLIC_ENV === "production"
    ? "stripe"
    : "flutterwave";
};
