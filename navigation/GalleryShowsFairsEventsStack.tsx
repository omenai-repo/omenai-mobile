import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ShowsFairsEvents from "#screens/marketplace/gallery/showsFairsEvents/ShowsFairsEvents";
import CreateGalleryEventScreen from "#screens/marketplace/gallery/showsFairsEvents/CreateGalleryEventScreen";

export type GalleryShowsFairsEventsStackParamList = {
  GalleryShowsFairsEventsMain: undefined;
  "create-gallery-event": undefined;
};

const Stack = createNativeStackNavigator<GalleryShowsFairsEventsStackParamList>();

export default function GalleryShowsFairsEventsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: "#F7F7F7" },
      }}
    >
      <Stack.Screen name="GalleryShowsFairsEventsMain" component={ShowsFairsEvents} />
      <Stack.Screen name="create-gallery-event" component={CreateGalleryEventScreen} />
    </Stack.Navigator>
  );
}
