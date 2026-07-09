import { getApp } from "@react-native-firebase/app";
import { initializeAppCheck } from "@react-native-firebase/app-check";

export function initializeAppCheckConfig() {
  console.log(process.env.EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN_IOS);
  initializeAppCheck(getApp(), {
    provider: {
      providerOptions: {
        android: {
          provider: __DEV__ ? "debug" : "playIntegrity",
          debugToken: process.env.EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN,
        },
        apple: {
          provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
          debugToken: process.env.EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN_IOS,
        },
      },
    },
    isTokenAutoRefreshEnabled: true,
  });
}
