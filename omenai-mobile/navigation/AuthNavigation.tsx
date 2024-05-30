import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { screenName } from 'constants/screenNames.constants'
import Welcome from 'screens/welcome/Welcome'
import Login from 'screens/login/Login'
import Register from 'screens/register/Register'
import ForgotPassword from 'screens/forgotPassword/ForgotPassword'
import { createStackNavigator } from '@react-navigation/stack'

export default function AuthNavigation() {

    const Stack = createStackNavigator();
    return (
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
}

const styles = StyleSheet.create({})