import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ShowsFairsEvents from "#screens/gallery/showsFairsEvents/ShowsFairsEvents";
import {
  primaryTabRootNavigatorScreenOptions,
} from "#navigation/config/primaryTabNativeStackHeader";

export type GalleryShowsFairsEventsStackParamList = {
  GalleryShowsFairsEventsMain: undefined;
};

const Stack = createNativeStackNavigator<GalleryShowsFairsEventsStackParamList>();

export default function GalleryShowsFairsEventsStack() {
  return (
    <Stack.Navigator screenOptions={primaryTabRootNavigatorScreenOptions}>
      <Stack.Screen
        name="GalleryShowsFairsEventsMain"
        component={ShowsFairsEvents}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
