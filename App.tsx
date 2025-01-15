import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "store/app/appStore";
import { utils_appInit } from "utils/utils_appInit";
import { useFonts } from "expo-font";
import IndividualNavigation from "navigation/IndividualNavigation";
import AuthNavigation from "navigation/AuthNavigation";
import GalleryNavigation from "navigation/GalleryNavigation";
import * as Linking from "expo-linking";
import { screenName } from "constants/screenNames.constants";
import { StripeProvider } from "@stripe/stripe-react-native";
import { CopilotProvider } from "react-native-copilot";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { isLoggedIn, userType } = useAppStore();

  const prefix = Linking.createURL("/");

  const config = {
    screens: {
      CancleOrderPayment: "CancleOrderPayment",
      SuccessOrderPayment: "SuccessOrderPayment",
    },
  };

  const linking = {
    prefixes: [prefix],
    config,
  };

  const [fontsLoaded] = useFonts({
    nunitoSans: require("./assets/fonts/nunito-sans.ttf"),
  });

  //add logic for conditional routing
  useEffect(() => {
    utils_appInit();
  }, [isLoggedIn]);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <CopilotProvider>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK as string}
        >
          <NavigationContainer linking={linking}>
            {/* AUTH SCREENS */}
            {!isLoggedIn && <AuthNavigation />}
            {/* App screens */}
            {isLoggedIn && userType === "gallery" && <GalleryNavigation />}
            {isLoggedIn && userType === "user" && <IndividualNavigation />}
          </NavigationContainer>
        </StripeProvider>
      </GestureHandlerRootView>
    </CopilotProvider>
  );
}
