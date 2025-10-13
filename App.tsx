import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from 'store/app/appStore';
import { utils_appInit } from 'utils/utils_appInit';
import { useFonts } from 'expo-font';
import IndividualNavigation from 'navigation/IndividualNavigation';
import AuthNavigation from 'navigation/AuthNavigation';
import GalleryNavigation from 'navigation/GalleryNavigation';
import * as Linking from 'expo-linking';
import { screenName } from 'constants/screenNames.constants';
import { StripeProvider } from '@stripe/stripe-react-native';
import { CopilotProvider } from 'react-native-copilot';
import * as SplashScreen from 'expo-splash-screen';
import ArtistNavigation from 'navigation/ArtistNavigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppState, Platform } from 'react-native';
import { configureNotificationHandling } from 'notifications/NotificationService';
import { useNotifications } from 'hooks/useNotifications';
import { registerForPushToken } from 'notifications/registerForPushToken';
import { navigationRef } from 'navigation/RootNavigation';
import { useNotificationHandler } from 'hooks/useNotificationHandler';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://574c844d2d0b2e85a03f0af7904e0479@o4510158375419904.ingest.de.sentry.io/4510158405632080',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  // enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

if (!Platform.constants) {
  Platform.constants = {
    reactNativeVersion: { major: 0, minor: 0, patch: 0 },
    isTesting: false,
    // Add other required constants
  };
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default Sentry.wrap(function App() {
  useNotificationHandler(); // Set up notification handler
  const [appIsReady, setAppIsReady] = useState(false);
  const { isLoggedIn, userType, setExpoPushToken } = useAppStore();

  configureNotificationHandling(); // Set up global handler
  useNotifications(); // Register listeners

  useEffect(() => {
    const initPush = async () => {
      const token = await registerForPushToken();
      if (token) {
        setExpoPushToken(token);
      }
    };

    initPush();
  }, []);

  const prefix = Linking.createURL('/');

  const config = {
    screens: {
      CancleOrderPayment: 'CancleOrderPayment',
      SuccessOrderPayment: 'SuccessOrderPayment',
    },
  };

  const linking = {
    prefixes: [prefix],
    config,
  };

  const [fontsLoaded] = useFonts({
    nunitoSans: require('./assets/fonts/nunito-sans.ttf'),
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

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false, // RN: safe to disable
          },
        },
      }),
  );

  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active');
    });
    return () => unsubscribe.remove();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <CopilotProvider>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK as string}
              urlScheme="omenaimobile"
            >
              <NavigationContainer ref={navigationRef} linking={linking}>
                {/* AUTH SCREENS */}
                {!isLoggedIn && <AuthNavigation />}
                {/* App screens */}
                {isLoggedIn && userType === 'gallery' && <GalleryNavigation />}
                {isLoggedIn && userType === 'user' && <IndividualNavigation />}
                {isLoggedIn && userType === 'artist' && <ArtistNavigation />}
              </NavigationContainer>
            </StripeProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </CopilotProvider>
  );
});
