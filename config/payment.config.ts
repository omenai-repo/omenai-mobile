import {
  EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY,
  EXPO_PUBLIC_FLW_TEST_SECRET_KEY,
  EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY,
  EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID,
  EXPO_PUBLIC_FLW_SECRET_HASH,
  EXPO_PUBLIC_STRIPE_SK,
  EXPO_PUBLIC_STRIPE_PK,
  EXPO_PUBLIC_ENV,
} from '@env';

export const paymentConfig = {
  flutterwave: {
    testPublicKey: EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY!,
    testSecretKey: EXPO_PUBLIC_FLW_TEST_SECRET_KEY!,
    testEncryptionKey: EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY!,
    paymentPlanId: EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID!,
    secretHash: EXPO_PUBLIC_FLW_SECRET_HASH!,
  },
  stripe: {
    secretKey: EXPO_PUBLIC_STRIPE_SK!,
    publicKey: EXPO_PUBLIC_STRIPE_PK!,
  },
} as const;

export const isTestMode = () => {
  return EXPO_PUBLIC_ENV !== 'production';
};

export const getPaymentGateway = () => {
  return EXPO_PUBLIC_ENV === 'production' ? 'stripe' : 'flutterwave';
};
