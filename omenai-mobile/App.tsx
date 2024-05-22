//screens import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Welcome from './screens/welcome/Welcome';
import { screenName } from './constants/screenNames.constants';
import ForgotPassword from './screens/forgotPassword/ForgotPassword';
import SearchResults from 'screens/searchResults/SearchResults';
import Home from './screens/home/Home';
import { useEffect, useState } from 'react';
import { useAppStore } from 'store/app/appStore';
import { appInit } from 'utils/appInit';
import Catalog from 'screens/catalog/Catalog';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const {isLoggedIn} = useAppStore()

  //add logic for conditional routing
  useEffect(() => {
    appInit()
  }, [])

  const AuthNavigation = () => {
    return(
      <Stack.Navigator initialRouteName={screenName.welcome}>
        <Stack.Screen 
          name={screenName.welcome} 
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name={screenName.login} 
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name={screenName.register} 
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name={screenName.forgotPassword} 
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    )
  };

  const IndividualNavigation = () => {
    return(
      <Tab.Navigator>
        <Tab.Screen
          name={screenName.home}
          component={Home}
          options={{headerShown: false}}
        />
        <Tab.Screen 
          name={screenName.catalog} 
          component={Catalog}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name={screenName.searchResults} 
          component={SearchResults}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {/* AUTH SCREENS */}
        {!isLoggedIn &&
          <AuthNavigation />
        }
        {/* App screens */}
        {isLoggedIn &&
          <IndividualNavigation />
        }
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}