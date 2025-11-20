import { Client } from "rollbar-react-native";

export const rollbarNativeInstance = new Client({
  accessToken: process.env.EXPO_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// Both web and native return the Rollbar.js interface here.
export const rollbar = rollbarNativeInstance.rollbar;
