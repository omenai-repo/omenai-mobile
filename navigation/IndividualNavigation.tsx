import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { screenName } from "constants/screenNames.constants";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Catalog from "screens/catalog/Catalog";
import Profile from "screens/profile/Profile";
import SavedArtworks from "screens/savedArtworks/SavedArtworks";
import PurchaseArtwork from "screens/purchase/PurchaseArtwork";
import { colors } from "config/colors.config";
import Home from "screens/home/Home";
import Artwork from "screens/artwork/Artwork";
import SearchResults from "screens/searchResults/SearchResults";
import Orders from "screens/orders/Orders";
import Payment from "screens/payment/Payment";
import Filter from "components/filter/Filter";
import Notifications from "screens/notifications/Notifications";
import EditorialsListing from "screens/editorialsListing/EditorialsListing";
import CancleOrderPayment from "screens/payment/components/cancel/CancleOrderPayment";
import SuccessOrderPayment from "screens/payment/components/success/SuccessOrderPayment";
import EditProfile from "screens/editProfile/EditProfile";
import ArtworksMedium from "screens/artworksMedium/ArtworksMedium";
import ArtworkMediumFilterModal from "screens/artworksMedium/components/filter/ArtworkMediumFilterModal";
import Editorial from "screens/editorial/Editorial";
import ArtworkCategories from "screens/artworkCategories/ArtworkCategories";
import ArtworkCategoriesFilterModal from "screens/artworkCategories/components/filter/ArtworkCategoriesFilterModal";
import Collections from "screens/collections/Collections";
import ChangeGalleryPassword from "screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import { SvgXml } from "react-native-svg";
import {
  catalogueIcon,
  catalogueIconFocused,
  homeIcon,
  homeIconFocused,
  orderIcon,
  orderIconFocused,
  profileIcon,
  profileIconFocused,
  searchIcon,
  searchIconFocused,
} from "utils/SvgImages";

type CustomTabBarIconProps = {
  name: any;
  focused: boolean;
  title: string;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

export default function IndividualNavigation() {
  const CustomTabBarIcon = ({
    name,
    focused,
    title,
  }: CustomTabBarIconProps) => {
    return (
      <View
        style={{
          alignItems: "center",
          gap: 5,
        }}
      >
        <SvgXml xml={name} />
        <Text
          style={[
            { fontSize: 13, color: colors.grey },
            focused && { color: colors.white },
          ]}
        >
          {title}
        </Text>
      </View>
    );
  };

  const IndividualTabNavigationScreens = () => {
    const { width } = useWindowDimensions();
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName = "";

            if (route.name === screenName.home) {
              iconName = !focused ? homeIconFocused : homeIcon;
            } else if (route.name === screenName.catalog) {
              iconName = !focused ? catalogueIconFocused : catalogueIcon;
            } else if (route.name === screenName.orders) {
              iconName = !focused ? orderIconFocused : orderIcon;
            } else if (route.name === screenName.profile) {
              iconName = !focused ? profileIconFocused : profileIcon;
            } else if (route.name === screenName.searchResults) {
              iconName = !focused ? searchIconFocused : searchIcon;
            }

            return (
              <CustomTabBarIcon
                title={route.name}
                name={iconName}
                focused={focused}
              />
            );
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 82,
            backgroundColor: colors.black,
            bottom: 30,
            borderRadius: 18,
            marginHorizontal: width / 18,
            position: "absolute",
            paddingTop: Platform.OS === "ios" ? 25 : 0,
          },
        })}
      >
        <Tab.Screen name={screenName.home} component={Home} />
        <Tab.Screen name={screenName.catalog} component={Catalog} />
        <Tab.Screen name={screenName.searchResults} component={SearchResults} />
        <Tab.Screen name={screenName.orders} component={Orders} />
        <Tab.Screen name={screenName.profile} component={Profile} />
      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Individual"
        component={IndividualTabNavigationScreens}
        options={hideHeader}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name={screenName.filter} component={Filter} />
        <Stack.Screen
          name={screenName.artworkMediumFilterModal}
          component={ArtworkMediumFilterModal}
        />
        <Stack.Screen
          name={screenName.artworkCategoriesFilterModal}
          component={ArtworkCategoriesFilterModal}
        />
      </Stack.Group>
      <Stack.Screen name={screenName.artwork} component={Artwork} />
      <Stack.Screen name={screenName.searchResults} component={SearchResults} />
      <Stack.Screen
        name={screenName.purchaseArtwork}
        component={PurchaseArtwork}
      />
      <Stack.Screen name={screenName.savedArtworks} component={SavedArtworks} />
      <Stack.Screen name={screenName.payment} component={Payment} />
      <Stack.Screen name={screenName.notifications} component={Notifications} />
      <Stack.Screen
        name={screenName.editorialsListing}
        component={EditorialsListing}
      />
      <Stack.Screen
        name={screenName.cancleOrderPayment}
        component={CancleOrderPayment}
      />
      <Stack.Screen
        name={screenName.successOrderPayment}
        component={SuccessOrderPayment}
      />
      <Stack.Screen name={screenName.editProfile} component={EditProfile} />
      <Stack.Screen
        name={screenName.gallery.changePassword}
        component={ChangeGalleryPassword}
      />
      <Stack.Screen
        name={screenName.artworksMedium}
        component={ArtworksMedium}
      />
      <Stack.Screen name={screenName.editorial} component={Editorial} />
      <Stack.Screen
        name={screenName.artworkCategories}
        component={ArtworkCategories}
      />
      <Stack.Screen name={screenName.collections} component={Collections} />
    </Stack.Navigator>
  );
}
