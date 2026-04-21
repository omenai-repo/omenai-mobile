import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "#screens/home/Home";
import {
  primaryTabRootNavigatorScreenOptions,
  primaryTabRootScreenHeaderOptions,
} from "#navigation/config/primaryTabNativeStackHeader";

export type IndividualHomeStackParamList = {
  IndividualHomeMain: undefined;
};

const Stack = createNativeStackNavigator<IndividualHomeStackParamList>();

export default function IndividualHomeStack() {
  return (
    <Stack.Navigator screenOptions={primaryTabRootNavigatorScreenOptions}>
      <Stack.Screen
        name="IndividualHomeMain"
        component={Home}
        options={primaryTabRootScreenHeaderOptions("individual-home")}
      />
    </Stack.Navigator>
  );
}
