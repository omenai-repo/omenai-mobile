const {
  APP_VERSION,
  ANDROID_VERSION_CODE,
  IOS_BUILD_NUMBER,
  RUNTIME_VERSION,
} = require("./constants/version.constants");

export default {
  expo: {
    name: "Omenai",
    scheme: "omenaimobile",
    slug: "omenai-app",
    owner: "omenaiinc",
    version: APP_VERSION,
    orientation: "portrait",
    newArchEnabled: true,
    experiments: {
      tsconfigPaths: true,
    },
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.omenai.omenaimobile",
      buildNumber: IOS_BUILD_NUMBER,
      associatedDomains: ["applinks:omenai.app"],
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserNotificationUsageDescription:
          "This app uses notifications to keep you updated.",
        NSFaceIDUsageDescription:
          "Allow Omenai to use Face ID for secure and convenient login.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
      package: "com.omenai.omenaiapp",
      permissions: ["android.permission.RECORD_AUDIO"],
      versionCode: ANDROID_VERSION_CODE,
      softwareKeyboardLayoutMode: "pan",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "omenai.app",
              pathPrefix: "/dl",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
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
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 30000,
    },
    plugins: [
      "@react-native-community/datetimepicker",
      "expo-image",
      "expo-sharing",
      [
        "@stripe/stripe-react-native",
        {},
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/PT_Serif/PTSerif-Regular.ttf",
            "./assets/fonts/PT_Serif/PTSerif-Bold.ttf",
            "./assets/fonts/Work_Sans/static/WorkSans-Light.ttf",
            "./assets/fonts/Work_Sans/static/WorkSans-ExtraLight.ttf",
            "./assets/fonts/Work_Sans/static/WorkSans-Regular.ttf",
            "./assets/fonts/Work_Sans/static/WorkSans-Bold.ttf",
          ],
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          resizeMode: "contain",
          backgroundColor: "#FFFFFF",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Omenai app accesses your photos to let you upload artworks.",
        },
      ],

      "expo-web-browser",
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow Omenai to access your Face ID biometric data.",
        },
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow Omenai to use Face ID.",
        },
      ],
    ],
  },
};
