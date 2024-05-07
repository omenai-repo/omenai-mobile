//screens import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Welcome from './screens/welcome/Welcome';
import { screenName } from '@/constants/screenNames.constants';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* AUTH SCREENS */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}