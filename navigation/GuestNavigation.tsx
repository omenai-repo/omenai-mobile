import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getBottomTabDataGuest } from "#utils/BottomTabData";
import CustomTabBar from "./components/TabButton";
import { wrapWithHighRisk } from "#utils/wrapWithProvider";
import { screenName } from "#constants/screenNames.constants";
import Filter from "#components/filter/Filter";
import ArtworkMediumFilterModal from "#screens/artworksMedium/components/filter/ArtworkMediumFilterModal";
import ArtworkCategoriesFilterModal from "#screens/artworkCategories/components/filter/ArtworkCategoriesFilterModal";
import Artwork from "#screens/artwork/Artwork";
import SearchResults from "#screens/searchResults/SearchResults";
import ArticleScreen from "#screens/home/components/editorials/ArticleScreen";
import DetailsScreen from "#screens/home/components/DetailScreen";
import ArtworksMedium from "#screens/artworksMedium/ArtworksMedium";
import Collections from "#screens/collections/Collections";
import AllEditorialsScreen from "#screens/home/components/editorials/AllEditorialsScreen";
import AuthNavigation from "./AuthNavigation";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GuestTabBar = (props: any) => (
  <CustomTabBar {...props} tabData={getBottomTabDataGuest()} />
);

const GuestTabNavigationScreens = () => {
  return (
    <Tab.Navigator
      tabBar={GuestTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      {getBottomTabDataGuest().map(({ name, component, id }: { name: string; component: any; id: number }) => (
        <Tab.Screen
          key={id}
          name={name}
          component={component}
          options={{
            tabBarShowLabel: false,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default function GuestNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GuestTabs"
        component={GuestTabNavigationScreens}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthNavigation"
        component={AuthNavigation}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name={screenName.filter}
          component={wrapWithHighRisk(Filter)}
        />
        <Stack.Screen
          name={screenName.artworkMediumFilterModal}
          component={wrapWithHighRisk(ArtworkMediumFilterModal)}
        />
        <Stack.Screen
          name={screenName.artworkCategoriesFilterModal}
          component={wrapWithHighRisk(ArtworkCategoriesFilterModal)}
        />
      </Stack.Group>
      <Stack.Screen
        name={screenName.artwork}
        component={wrapWithHighRisk(Artwork)}
      />
      <Stack.Screen
        name={screenName.searchResults}
        component={wrapWithHighRisk(SearchResults)}
      />
      <Stack.Screen
        name={"ArticleScreen"}
        component={wrapWithHighRisk(ArticleScreen)}
      />
      <Stack.Screen
        name={"DetailsScreen"}
        component={wrapWithHighRisk(DetailsScreen)}
      />
      <Stack.Screen
        name={screenName.artworksMedium}
        component={wrapWithHighRisk(ArtworksMedium)}
      />
      <Stack.Screen
        name={screenName.collections}
        component={wrapWithHighRisk(Collections)}
      />
      <Stack.Screen
        name={"AllEditorialsScreen"}
        component={wrapWithHighRisk(AllEditorialsScreen)}
      />
    </Stack.Navigator>
  );
}
