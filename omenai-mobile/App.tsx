//screens import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Welcome from './screens/welcome/Welcome';
import { screenName } from './constants/screenNames.constants';
import ForgotPassword from './screens/forgotPassword/ForgotPassword';
import SearchResults from 'screens/searchResults/SearchResults';
import Home from './screens/home/Home';
import { useState } from 'react';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  //add logic for conditional routing

  return (
    <NavigationContainer>
      {/* AUTH SCREENS */}
      {!isLoggedIn &&
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
      }
      {/* App screens */}
      {isLoggedIn &&
        <Stack.Navigator initialRouteName={screenName.home}>
          <Stack.Screen
            name={screenName.home}
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name={screenName.searchResults} 
            component={SearchResults}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}