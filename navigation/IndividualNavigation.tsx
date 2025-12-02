import { Text, View } from "react-native";
import React from "react";
import { screenName } from "constants/screenNames.constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import SavedArtworks from "screens/savedArtworks/SavedArtworks";
import PurchaseArtwork from "screens/purchase/PurchaseArtwork";
import { colors } from "config/colors.config";
import Artwork from "screens/artwork/Artwork";
import SearchResults from "screens/searchResults/SearchResults";
import Filter from "components/filter/Filter";
import EditProfile from "screens/editProfile/EditProfile";
import ArtworksMedium from "screens/artworksMedium/ArtworksMedium";
import ArtworkMediumFilterModal from "screens/artworksMedium/components/filter/ArtworkMediumFilterModal";
import ArtworkCategoriesFilterModal from "screens/artworkCategories/components/filter/ArtworkCategoriesFilterModal";
import Collections from "screens/collections/Collections";
import ChangeGalleryPassword from "screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import { SvgXml } from "react-native-svg";
import { BottomTabDataIndividual } from "utils/BottomTabData";
import ShipmentTrackingScreen from "screens/artist/orders/ShipmentTrackingScreen";
import EditAddressScreen from "screens/editProfile/EditAddressScreen";
import CustomTabBar from "./components/TabButton";
import DetailsScreen from "screens/home/components/DetailScreen";
import ArticleScreen from "screens/home/components/editorials/ArticleScreen";
import AllEditorialsScreen from "screens/home/components/editorials/AllEditorialsScreen";
import NotificationScreen from "screens/notifications/NotificationScreen";
import DeleteAccountScreen from "screens/deleteAccount/DeleteAccountScreen";
import Payment from "screens/payment/Payment";
import { wrapWithHighRisk, wrapWithLowRisk } from "utils/wrapWithProvider";
import CancleOrderPayment from "screens/payment/components/cancel/CancleOrderPayment";
import SuccessOrderPayment from "screens/payment/components/success/SuccessOrderPayment";
import BiometricSettings from "screens/profile/BiometricSettings";

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
    return (
      <Tab.Navigator
        tabBar={(props) => (
          <CustomTabBar {...props} tabData={BottomTabDataIndividual} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        {BottomTabDataIndividual.map(({ name, component, id }) => (
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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* High-risk screens */}
      <Stack.Screen
        name="Individual"
        component={wrapWithHighRisk(IndividualTabNavigationScreens)}
        options={hideHeader}
      />

      {/* Low-risk screen */}
      <Stack.Screen
        name="ShipmentTrackingScreen"
        component={wrapWithLowRisk(ShipmentTrackingScreen)}
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
        name={screenName.purchaseArtwork}
        component={wrapWithHighRisk(PurchaseArtwork)}
      />
      <Stack.Screen
        name={screenName.savedArtworks}
        component={wrapWithHighRisk(SavedArtworks)}
      />
      <Stack.Screen
        name={"NotificationScreen"}
        component={wrapWithHighRisk(NotificationScreen)}
      />
      <Stack.Screen
        name={screenName.editProfile}
        component={wrapWithHighRisk(EditProfile)}
      />
      <Stack.Screen
        name={"EditAddressScreen"}
        component={wrapWithHighRisk(EditAddressScreen)}
      />
      <Stack.Screen
        name={screenName.gallery.changePassword}
        component={wrapWithHighRisk(ChangeGalleryPassword)}
      />
      <Stack.Screen
        name={screenName.artworksMedium}
        component={wrapWithHighRisk(ArtworksMedium)}
      />
      <Stack.Screen
        name={"ArticleScreen"}
        component={wrapWithHighRisk(ArticleScreen)}
      />
      <Stack.Screen
        name={"AllEditorialsScreen"}
        component={wrapWithHighRisk(AllEditorialsScreen)}
      />
      <Stack.Screen
        name={screenName.collections}
        component={wrapWithHighRisk(Collections)}
      />
      <Stack.Screen
        name={screenName.payment}
        component={wrapWithHighRisk(Payment)}
      />
      <Stack.Screen
        name={screenName.cancleOrderPayment}
        component={wrapWithHighRisk(CancleOrderPayment)}
      />
      <Stack.Screen
        name={screenName.successOrderPayment}
        component={wrapWithHighRisk(SuccessOrderPayment)}
      />
      <Stack.Screen
        name={"DetailsScreen"}
        component={wrapWithHighRisk(DetailsScreen)}
      />
      <Stack.Screen
        name={screenName.deleteAccount}
        component={wrapWithHighRisk(DeleteAccountScreen)}
      />
      <Stack.Screen
        name={screenName.biometricSettings}
        component={wrapWithHighRisk(BiometricSettings)}
      />
    </Stack.Navigator>
  );
}
