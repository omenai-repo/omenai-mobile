import React, { useEffect, useState, useCallback } from "react";
import {
  NavigationContainer,
  getStateFromPath as getStateFromPathDefault,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppStore } from "#store/app/appStore";
import { utils_appInit } from "#utils/utils_appInit";
import { useFonts } from "expo-font";
import IndividualNavigation from "#navigation/IndividualNavigation";
import AuthNavigation from "#navigation/AuthNavigation";
import GalleryNavigation from "#navigation/GalleryNavigation";
import * as Linking from "expo-linking";
import { StripeProvider } from "@stripe/stripe-react-native";
import { CopilotProvider } from "react-native-copilot";
import * as SplashScreen from "expo-splash-screen";
import ArtistNavigation from "#navigation/ArtistNavigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { AppState, Platform, View, Text, TextInput } from "react-native";
import { configureNotificationHandling } from "#notifications/NotificationService";
import { useNotifications } from "#hooks/useNotifications";
import { registerForPushToken } from "#notifications/registerForPushToken";
import { navigationRef } from "#navigation/RootNavigation";
import { useNotificationHandler } from "#hooks/useNotificationHandler";
import { StatusBar } from "expo-status-bar";
import { clearStaleCredentials } from "#hooks/useBiometrics";
import ForceUpdateModal from "#components/modal/ForceUpdateModal";
import { useVersionCheck } from "#hooks/useVersionCheck";
import { Analytics } from "#utils/analytics";
import * as Updates from "expo-updates";
import { SupportProvider } from "#providers/SupportProvider";
import SupportWidget from "#components/support/SupportWidget";
import WithModal from "#components/modal/WithModal";
import GuestLoginModal from "#components/guest/GuestLoginModal";
import { screenName } from "#constants/screenNames.constants";
import {
  normalizeIncomingDeepLinkPath,
  extractSafeDeepLinkToken,
  buildAppUrlFromPathAndToken,
} from "#config/deepLinking.config";
import { verifyDeepLinkToken } from "#services/deeplink/verifyDeepLinkToken";

// Set default font for all Text and TextInput components
// @ts-ignore
if (Text.defaultProps) {
  // @ts-ignore
  Text.defaultProps.style = { fontFamily: "WorkSans-Light" };
} else {
  // @ts-ignore
  Text.defaultProps = { style: { fontFamily: "WorkSans-Light" } };
}

// @ts-ignore
if (TextInput.defaultProps) {
  // @ts-ignore
  TextInput.defaultProps.style = { fontFamily: "WorkSans-Light" };
} else {
  // @ts-ignore
  TextInput.defaultProps = { style: { fontFamily: "WorkSans-Light" } };
}

// Vexo analytic initialization
Analytics.init(process.env.EXPO_PUBLIC_VEXO_ID as string);

// Safely patch Platform.constants for web/dev environments only
try {
  if (!Platform.constants) {
    Platform.constants = {
      reactNativeVersion: { major: 0, minor: 0, patch: 0 },
      isTesting: false,
    };
  }
} catch (error) {
  console.warn("Failed to patch Platform.constants:", error);
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

async function checkForOTAUpdate() {
  if (Updates.channel === "production") return;
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch {
    // Continue to app start if update check fails
  }
}

export default function App() {
  useNotificationHandler(); // Set up notification handler
  const [appIsReady, setAppIsReady] = useState(false);
  const { isLoggedIn, userType, setExpoPushToken } = useAppStore();

  const [needsForceUpdate, setNeedsForceUpdate] = useState(false);

  const handleUpdateNeeded = useCallback((versionCheckResult: any) => {
    if (versionCheckResult.needsUpdate) {
      setNeedsForceUpdate(true);
    }
  }, []);

  // Check version on app initialization
  useVersionCheck(handleUpdateNeeded);

  configureNotificationHandling(); // Set up global handler
  useNotifications(); // Register listeners

  useEffect(() => {
    async function prepare() {
      try {
        await clearStaleCredentials();
        const token = await registerForPushToken();
        if (token) setExpoPushToken(token);
        await checkForOTAUpdate();
        await utils_appInit();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [setExpoPushToken]);

  const prefix = Linking.createURL("/");

  const config = {
    screens: {
      Login: "login",
      [screenName.cancleOrderPayment]: "CancleOrderPayment",
      [screenName.successOrderPayment]: "SuccessOrderPayment",
      Individual: {
        screens: {
          Overview: "dl/individual/overview",
          Artworks: "dl/individual/artworks",
          Search: "dl/individual/search",
          Orders: "dl/individual/orders",
          Profile: "dl/individual/profile",
          [screenName.payment]: "dl/individual/payment",
          [screenName.artwork]: "dl/individual/artwork/:id",
        },
      },
      Artist: {
        screens: {
          Overview: "dl/artist/overview",
          Artworks: "dl/artist/artworks",
          Orders: "dl/artist/orders",
          Review: "dl/artist/review",
          Profile: "dl/artist/profile",
          [screenName.artwork]: "dl/artist/artwork/:id",
        },
      },
      Gallery: {
        screens: {
          Overview: "dl/gallery/overview",
          Artworks: "dl/gallery/artworks",
          Orders: "dl/gallery/orders",
          Billing: "dl/gallery/billing",
          Payouts: "dl/gallery/payouts",
          Profile: "dl/gallery/profile",
          [screenName.artwork]: "dl/gallery/artwork/:id",
        },
      },
    },
  };

  const linking = {
    prefixes: [prefix, "https://omenai.app", "omenai://"],
    config,
    resolveIncomingUrl: async (url: string) => {
      const parsed = Linking.parse(url);
      const path = parsed.path ?? "";
      const token = extractSafeDeepLinkToken(parsed.queryParams?.token);
      const verified = token ? await verifyDeepLinkToken(token) : null;
      const normalizedPath = normalizeIncomingDeepLinkPath({
        path,
        options: { isLoggedIn, userType },
        verifiedPayload: verified?.payload,
        hasToken: !!token,
      });

      return buildAppUrlFromPathAndToken(prefix, normalizedPath, token);
    },
    getInitialURL: async () => {
      const url = await Linking.getInitialURL();
      if (!url) return null;
      return linking.resolveIncomingUrl(url);
    },
    subscribe: (listener: (url: string) => void) => {
      const onReceiveURL = ({ url }: { url: string }) => {
        linking
          .resolveIncomingUrl(url)
          .then((safeUrl) => listener(safeUrl))
          .catch(() => listener(`${prefix}login`));
      };

      const subscription = Linking.addEventListener("url", onReceiveURL);
      return () => subscription.remove();
    },
    getStateFromPath: (path: string, options: any) => {
      const [rawPath] = path.split("?");
      const normalizedPath = normalizeIncomingDeepLinkPath({
        path: rawPath ?? path,
        options: { isLoggedIn, userType },
        hasToken: false,
      });

      return getStateFromPathDefault(normalizedPath, options);
    },
  };

  const [fontsLoaded] = useFonts({
    "WorkSans-Light": require("./assets/fonts/Work_Sans/static/WorkSans-Light.ttf"),
    "WorkSans-ExtraLight": require("./assets/fonts/Work_Sans/static/WorkSans-ExtraLight.ttf"),
    "WorkSans-Regular": require("./assets/fonts/Work_Sans/static/WorkSans-Regular.ttf"),
    "WorkSans-Medium": require("./assets/fonts/Work_Sans/static/WorkSans-Medium.ttf"),
    "WorkSans-SemiBold": require("./assets/fonts/Work_Sans/static/WorkSans-SemiBold.ttf"),
    "WorkSans-Bold": require("./assets/fonts/Work_Sans/static/WorkSans-Bold.ttf"),
    "WorkSans-ExtraBold": require("./assets/fonts/Work_Sans/static/WorkSans-ExtraBold.ttf"),
    "WorkSans-Black": require("./assets/fonts/Work_Sans/static/WorkSans-Black.ttf"),
    "PTSerif-Regular": require("./assets/fonts/PT_Serif/PTSerif-Regular.ttf"),
    "PTSerif-Italic": require("./assets/fonts/PT_Serif/PTSerif-Italic.ttf"),
    "PTSerif-Bold": require("./assets/fonts/PT_Serif/PTSerif-Bold.ttf"),
    "PTSerif-BoldItalic": require("./assets/fonts/PT_Serif/PTSerif-BoldItalic.ttf"),
  });

  const onLayoutRootView = useCallback(() => {
    if (appIsReady && fontsLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync().catch((err) => {
        console.error("Failed to hide splash screen:", err);
      });
    }
  }, [appIsReady, fontsLoaded]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60_000, // 5 minutes — avoid redundant refetches
            gcTime: 30 * 60_000, // 30 minutes — keep cached data in memory
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false, // RN: safe to disable
          },
        },
      }),
  );

  useEffect(() => {
    const unsubscribe = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active");
    });
    return () => unsubscribe.remove();
  }, []);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <CopilotProvider>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <SupportProvider>
              <BottomSheetModalProvider>
                <StripeProvider
                  publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK as string}
                  urlScheme="omenaimobile"
                >
                  <NavigationContainer ref={navigationRef} linking={linking}>
                    <WithModal>
                      <View style={{ flex: 1 }}>
                        {/* AUTH SCREENS */}
                        {!isLoggedIn && <AuthNavigation />}
                        {/* App screens */}
                        {isLoggedIn && userType === "gallery" && (
                          <GalleryNavigation />
                        )}
                        {isLoggedIn && userType === "user" && (
                          <IndividualNavigation />
                        )}
                        {isLoggedIn && userType === "artist" && (
                          <ArtistNavigation />
                        )}

                        <GuestLoginModal />
                        <SupportWidget />
                      </View>
                    </WithModal>
                  </NavigationContainer>
                </StripeProvider>
              </BottomSheetModalProvider>
            </SupportProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>

      {/* Force Update Modal - Cannot be dismissed */}
      <ForceUpdateModal isVisible={needsForceUpdate} />
    </CopilotProvider>
  );
}
