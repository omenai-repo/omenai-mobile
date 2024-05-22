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
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { StyleSheet, Text, View } from 'react-native';
import Orders from 'screens/orders/Orders';
import Profile from 'screens/profile/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type CustomTabBarIconProps = {
  name: string,
  focused: boolean
}

export default function App() {
  const {isLoggedIn} = useAppStore()

  //add logic for conditional routing
  useEffect(() => {
    appInit()
  }, [])

  const CustomTabBarIcon = ({ name, focused }: CustomTabBarIconProps) => {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <Feather name={name} size={20} color={focused ? 'white' : 'gray'} />
      </View>
    );
  };

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
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === screenName.home) {
              iconName = 'home';
            } else if (route.name === screenName.catalog) {
              iconName = 'bookmark';
            }else if(route.name === screenName.orders){
              iconName = 'package'
            }else if(route.name === screenName.profile){
              iconName = 'user'
            }

            return <CustomTabBarIcon name={iconName} focused={focused} />;;
          },
          tabBarActiveTintColor: colors.primary_black,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: colors.white,
            paddingBottom: 20,
            paddingTop: 10,
            height: 100,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}
      >
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
          name={screenName.orders} 
          component={Orders}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name={screenName.profile} 
          component={Profile}
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

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainerActive: {
    backgroundColor: colors.primary_black
  }
})