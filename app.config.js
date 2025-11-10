import {
  APP_VERSION,
  ANDROID_VERSION_CODE,
  IOS_BUILD_NUMBER,
  RUNTIME_VERSION,
} from "./constants/version.constants";

export default {
  expo: {
    name: "OMENAI",
    scheme: "omenaimobile",
    slug: "omenai-app",
    owner: "omenai",
    version: APP_VERSION,
    orientation: "portrait",
    newArchEnabled: true,
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.omenai.omenaimobile",
      buildNumber: IOS_BUILD_NUMBER,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/omenai-logo.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
      package: "com.omenai.omenaiapp",
      permissions: ["android.permission.RECORD_AUDIO"],
      versionCode: ANDROID_VERSION_CODE,
      softwareKeyboardLayoutMode: "pan",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "cfba8b4b-06f7-460a-8fa2-f8671ea18107",
      },
    },
    runtimeVersion: RUNTIME_VERSION,
    updates: {
      url: "https://u.expo.dev/cfba8b4b-06f7-460a-8fa2-f8671ea18107",
    },
    plugins: [
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/nunito-sans.ttf",
            "./assets/fonts/DMSans.ttf",
          ],
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Omenai app accesses your photos to let you upload artworks.",
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/omenai-logo.png",
          dark: {
            image: "./assets/omenai-logo.png",
            backgroundColor: "#1a1a1a",
          },
          imageWidth: 200,
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "omenai",
        },
      ],
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: true,
        },
      ],
    ],
  },
};
