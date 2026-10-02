import React from "react";
import { screenName } from "#constants/screenNames.constants";
import Welcome from "#screens/welcome/Welcome";
import Login from "#screens/auth/login/Login";
import Register from "#screens/auth/register/Register";
import ForgotPassword from "#screens/auth/password/forgotPassword/ForgotPassword";
import { createStackNavigator } from "@react-navigation/stack";
import VerifyEmail from "#screens/auth/verification/VerifyEmail";
import ArtistOnboarding from "#screens/auth/artistOnboarding/ArtistOnboarding";
import { LowRiskProvider } from "#providers/ConfigCatProvider";
import GuestNavigation from "./GuestNavigation";

export default function AuthNavigation() {
  const Stack = createStackNavigator();
  return (
    <LowRiskProvider>
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
        <Stack.Screen
          name={screenName.verifyEmail}
          component={VerifyEmail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"ArtistOnboarding"}
          component={ArtistOnboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"GuestNavigation"}
          component={GuestNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </LowRiskProvider>
  );
}
