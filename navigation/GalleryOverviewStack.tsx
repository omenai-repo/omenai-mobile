import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Overview from "#screens/marketplace/overview/Overview";
import {
  primaryTabRootNavigatorScreenOptions,
  primaryTabRootScreenHeaderOptions,
} from "#navigation/config/primaryTabNativeStackHeader";

export type GalleryOverviewStackParamList = {
  GalleryOverviewMain: undefined;
};

const Stack = createNativeStackNavigator<GalleryOverviewStackParamList>();

export default function GalleryOverviewStack() {
  return (
    <Stack.Navigator screenOptions={primaryTabRootNavigatorScreenOptions}>
      <Stack.Screen
        name="GalleryOverviewMain"
        component={Overview}
        options={primaryTabRootScreenHeaderOptions("gallery-overview")}
      />
    </Stack.Navigator>
  );
}
