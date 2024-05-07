//screens import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Welcome from './screens/welcome/Welcome';
import { SCREEN } from './constants/screenNames.constants';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* AUTH SCREENS */}
      <Stack.Navigator initialRouteName={SCREEN.WELCOME}>
        <Stack.Screen 
          name={SCREEN.WELCOME} 
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name={SCREEN.LOGIN} 
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name={SCREEN.REGISTER} 
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}