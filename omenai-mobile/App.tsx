import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useAppStore } from 'store/app/appStore';
import { appInit } from 'utils/appInit';
import { useFonts } from 'expo-font';
import IndividualNavigation from 'navigation/IndividualNavigation';
import AuthNavigation from 'navigation/AuthNavigation';
import GalleryNavigation from 'navigation/GalleryNavigation';

export default function App() {
  const {isLoggedIn, userType} = useAppStore()

  const [fontsLoaded] = useFonts({
    'nunitoSans': require('./assets/fonts/nunito-sans.ttf'),
  });
  
  //add logic for conditional routing
  useEffect(() => {
    appInit()
  }, [isLoggedIn])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
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
    </GestureHandlerRootView>
  );
}