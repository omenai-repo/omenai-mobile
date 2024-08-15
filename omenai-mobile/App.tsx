import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useAppStore } from 'store/app/appStore';
import { appInit } from 'utils/appInit';
import { useFonts } from 'expo-font';
import IndividualNavigation from 'navigation/IndividualNavigation';
import AuthNavigation from 'navigation/AuthNavigation';
import GalleryNavigation from 'navigation/GalleryNavigation';
import * as Linking from 'expo-linking';
import { screenName } from 'constants/screenNames.constants';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  const {isLoggedIn, userType} = useAppStore();

  const prefix = Linking.createURL('/');

  const config = {
    screens: {
      CancleOrderPayment: 'CancleOrderPayment',
      SuccessOrderPayment: 'SuccessOrderPayment'
    },
  };

  const linking = {
    prefixes: [prefix],
    config
  };

  const [fontsLoaded] = useFonts({
    'nunitoSans': require('./assets/fonts/nunito-sans.ttf'),
  });
  
  //add logic for conditional routing
  useEffect(() => {
    appInit()
  }, [isLoggedIn])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={process.env.STRIPE_PK}>
        <NavigationContainer linking={linking}>
          {/* AUTH SCREENS */}
          {!isLoggedIn &&
            <AuthNavigation />
          }
          {/* App screens */}
          {(isLoggedIn && userType === "gallery") &&
            <GalleryNavigation />
          }
          {(isLoggedIn && userType === "user") &&
            <IndividualNavigation />
          }
        </NavigationContainer>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}