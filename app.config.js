export default {
  expo: {
    name: "OMENAI",
    scheme: "omenaimobile",
    slug: "omenai-app",
    owner: "omenai",
    version: "1.1.22",
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
      buildNumber: "1.1.22",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          "Omenai app uses your location to deliver orders directly to your doorstep.",
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
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
      versionCode: 22,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
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
    runtimeVersion: "1.1.22",
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
