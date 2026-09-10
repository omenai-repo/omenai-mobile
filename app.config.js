const {
  APP_VERSION,
  ANDROID_VERSION_CODE,
  IOS_BUILD_NUMBER,
  RUNTIME_VERSION,
} = require("./constants/version.constants");

const {
  getAssociatedDomainsIOS,
  getAndroidIntentFilters,
} = require("./constants/deepLinkHost.constants");

const associatedDomainsIOS = getAssociatedDomainsIOS();
const androidIntentFilters = getAndroidIntentFilters();

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
      googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
      associatedDomains: associatedDomainsIOS,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserNotificationUsageDescription:
          "This app uses notifications to keep you updated.",
        NSFaceIDUsageDescription:
          "Allow Omenai to use Face ID for secure and convenient login.",
        NSCameraUsageDescription:
          "Omenai uses the camera to place artwork in your room with augmented reality.",
        NSLocationWhenInUseUsageDescription:
          "Omenai requires location access for augmented reality features.",
        NSMicrophoneUsageDescription:
          "Omenai requires microphone access to support augmented reality capabilities.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      useNextNotificationsApi: true,
      package: "com.omenai.omenaiapp",
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
      ],
      versionCode: ANDROID_VERSION_CODE,
      softwareKeyboardLayoutMode: "pan",
      intentFilters: androidIntentFilters,
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
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            forceStaticLinking: [
              "RNFBAnalytics",
              "RNFBApp",
              "RNFBAppCheck",
              "RNFBAuth",
              "RNFBCrashlytics",
              "RNFBFirestore",
              "RNFBMessaging",
              "RNFBRemoteConfig",
              "RNFBStorage",
              "RNFBSomeOtherRNFBModuleYouAreUsing",
            ],
          },
          android: {
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            manifestQueries: {
              package: ["com.google.ar.core"],
            },
            buildArchs: ["armeabi-v7a", "arm64-v8a"],
            // R8 fails on optional class references unless ignored (see minifyReleaseWithR8).
            extraProguardRules: `
              # Stripe: push provisioning classes are optional; @stripe/stripe-react-native still references them.
              -dontwarn com.stripe.android.pushProvisioning.**

              # Firebase Installations references firebase-ktx; KTX module not on the Android classpath here.
              -dontwarn com.google.firebase.ktx.**

              # Nimbus JOSE JWT optional Ed25519/X25519 paths reference Tink subtle APIs not bundled.
              -dontwarn com.google.crypto.tink.subtle.**

              # Guava/Google Common references java.lang.reflect.AnnotatedType which is missing in Android SDK
              -dontwarn java.lang.reflect.AnnotatedType

              # Viro / Google VR references optional telemetry + protobuf classes not packaged in release APK.
              -dontwarn com.google.common.logging.Vr$**
              -dontwarn com.google.common.logging.nano.**
              -dontwarn com.google.protobuf.**
              -dontwarn com.google.protobuf.nano.**
              -dontwarn logs.proto.wireless.performance.mobile.**
            `.trim(),
          },
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/app-check",
      "@react-native-community/datetimepicker",
      "expo-image",
      "expo-sharing",
      ["@stripe/stripe-react-native", {}],
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
      [
        "@reactvision/react-viro",
        {
          android: {
            xRMode: "AR",
          },
          ios: {
            cameraUsagePermission:
              "Omenai uses the camera to place this artwork in your room with augmented reality.",
          },
        },
      ],
      "./plugins/viro-with-simulator.js",
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
