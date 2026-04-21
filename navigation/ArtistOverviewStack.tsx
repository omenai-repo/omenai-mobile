import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ArtistOverview from "#screens/artist/overview/ArtistOverview";
import {
  primaryTabRootNavigatorScreenOptions,
  primaryTabRootScreenHeaderOptions,
} from "#navigation/config/primaryTabNativeStackHeader";

export type ArtistOverviewStackParamList = {
  ArtistOverviewMain: undefined;
};

const Stack = createNativeStackNavigator<ArtistOverviewStackParamList>();

export default function ArtistOverviewStack() {
  return (
    <Stack.Navigator screenOptions={primaryTabRootNavigatorScreenOptions}>
      <Stack.Screen
        name="ArtistOverviewMain"
        component={ArtistOverview}
        options={primaryTabRootScreenHeaderOptions("artist-overview")}
      />
    </Stack.Navigator>
  );
}
