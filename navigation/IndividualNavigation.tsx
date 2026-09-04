import React, { useCallback, useMemo, useRef } from "react";
import { screenName } from "#constants/screenNames.constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import SavedArtworks from "#screens/discovery/savedArtworks/SavedArtworks";
import SupportTicketsScreen from "#screens/account/profile/SupportTicketsScreen";
import PurchaseArtwork from "#screens/commerce/purchase/PurchaseArtwork";
import Artwork from "#screens/artwork/detail/Artwork";
import SearchResults from "#screens/discovery/search/SearchResults";
import Filter from "#components/filter/Filter";
import EditProfile from "#screens/account/profile/EditProfile";
import ArtworksMedium from "#screens/artwork/medium/ArtworksMedium";
import ArtworkMediumFilterModal from "#screens/artwork/medium/components/filter/ArtworkMediumFilterModal";
import ArtworkCategoriesFilterModal from "#screens/artwork/categories/components/filter/ArtworkCategoriesFilterModal";
import SupportTicketsFilterModal from "#screens/account/profile/components/SupportTicketsFilterModal";
import Collections from "#screens/discovery/collections/Collections";
import ChangePassword from "#screens/auth/password/changePassword/ChangePassword";
import ShipmentTrackingScreen from "#screens/marketplace/artist/orders/ShipmentTrackingScreen";
import EditAddressScreen from "#screens/account/profile/EditAddressScreen";
import DetailsScreen from "#screens/discovery/DetailScreen";
import ArticleScreen from "#screens/discovery/editorials/ArticleScreen";
import AllEditorialsScreen from "#screens/discovery/editorials/AllEditorialsScreen";
import NotificationScreen from "#screens/account/notifications/NotificationScreen";
import DeleteAccountScreen from "#screens/account/settings/DeleteAccountScreen";
import Payment from "#screens/commerce/payment/Payment";
import { wrapWithHighRisk, wrapWithLowRisk } from "#utils/wrapWithProvider";
import CancleOrderPayment from "#screens/commerce/payment/components/cancel/CancleOrderPayment";
import SuccessOrderPayment from "#screens/commerce/payment/components/success/SuccessOrderPayment";
import BiometricSettings from "#screens/auth/biometrics/BiometricSettings";
import ViewReceiptScreen from "#screens/commerce/orders/ViewReceiptScreen";
import ShowDetailsScreen from "#screens/marketplace/discovery/shows/ShowDetailsScreen";
import FairEventDetailsScreen from "#screens/marketplace/discovery/fairsEvents/FairEventDetailsScreen";
import GalleryDetailsScreen from "#screens/marketplace/discovery/galleries/GalleryDetailsScreen";
import ArtistDetailsScreen from "#screens/marketplace/discovery/artists/ArtistDetailsScreen";
import AllArtistsScreen from "#screens/marketplace/discovery/artists/AllArtistsScreen";
import IndividualHomeStack from "#navigation/IndividualHomeStack";
import Catalog from "#screens/discovery/catalog/Catalog";
import Orders from "#screens/commerce/orders/Orders";
import Profile from "#screens/account/profile/Profile";
import GalleryTabBar from "./components/GalleryTabBar";
import MoreSheet, { type MoreSheetItem } from "./components/MoreSheet";
import { MoreSheetProvider, useMoreSheet } from "./components/MoreSheetContext";
import { logout } from "#utils/auth/logout.utils";
import {
  homeIcon,
  homeIconFocused,
  catalogueIcon,
  catalogueIconFocused,
  searchIcon,
  searchIconFocused,
  orderIcon,
  orderIconFocused,
} from "#utils/assets/SvgImages";
import ArPreview from "#artwork/ar/ArPreview";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

const moreLabel = "More";

const individualTabs = [
  {
    id: 1,
    name: screenName.home,
    label: "Overview",
    component: IndividualHomeStack,
    activeIcon: homeIcon,
    inActiveIcon: homeIconFocused,
  },
  {
    id: 2,
    name: screenName.catalogListing,
    label: "Artworks",
    component: Catalog,
    activeIcon: catalogueIcon,
    inActiveIcon: catalogueIconFocused,
  },
  {
    id: 3,
    name: "individual-more",
    label: moreLabel,
    component: () => <View style={{ flex: 1, backgroundColor: "#F7F7F7" }} />,
  },
  {
    id: 4,
    name: screenName.searchResults,
    label: "Search",
    component: SearchResults,
    activeIcon: searchIcon,
    inActiveIcon: searchIconFocused,
  },
  {
    id: 5,
    name: screenName.orders,
    label: "Orders",
    component: Orders,
    activeIcon: orderIcon,
    inActiveIcon: orderIconFocused,
  },
];

const individualMoreTabs = [
  {
    id: 6,
    name: screenName.profile,
    label: "Profile",
    component: Profile,
  },
  {
    id: 10,
    name: screenName.supportTickets,
    label: "Support Tickets",
    component: SupportTicketsScreen,
  },
];

const renderIndividualTabBar = (
  props: any,
  navigationRef: React.MutableRefObject<any>,
  openMoreSheet: () => void,
) => {
  navigationRef.current = props.navigation;
  return (
    <GalleryTabBar
      {...props}
      tabMeta={individualTabs}
      moreRouteName="individual-more"
      onPressMore={openMoreSheet}
    />
  );
};

function IndividualTabs() {
  const { isMoreSheetOpen, closeMoreSheet, openMoreSheet } = useMoreSheet();
  const tabNavigationRef = useRef<any>(null);

  const navigateToScreen = useCallback((routeName: string) => {
    if (!tabNavigationRef.current) return;
    const tabRouteNames = [...individualTabs, ...individualMoreTabs].map(
      ({ name }) => name,
    );
    if (tabRouteNames.includes(routeName)) {
      tabNavigationRef.current.navigate(routeName);
      return;
    }
    tabNavigationRef.current.getParent()?.navigate(routeName);
  }, []);

  const moreSheetItems = useMemo<MoreSheetItem[]>(
    () => [
      {
        key: "profile",
        label: "Profile",
        routeName: screenName.profile,
        expoIconName: "person-outline" as const,
        onPress: () => navigateToScreen(screenName.profile),
      },
      {
        key: "support-tickets",
        label: "Support Tickets",
        routeName: screenName.supportTickets,
        expoIconName: "help-circle-outline" as const,
        onPress: () => navigateToScreen(screenName.supportTickets),
      },
      {
        key: "logout",
        label: "Logout",
        routeName: "logout",
        isDanger: true,
        onPress: () => void logout(),
      },
    ],
    [navigateToScreen],
  );

  return (
    <>
      <Tab.Navigator
        tabBar={(props) =>
          renderIndividualTabBar(props, tabNavigationRef, openMoreSheet)
        }
        screenOptions={{ headerShown: false }}
      >
        {individualTabs.map(({ name, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{ tabBarShowLabel: false, headerShown: false }}
          />
        ))}
        {individualMoreTabs.map(({ name, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{ tabBarShowLabel: false, headerShown: false }}
          />
        ))}
      </Tab.Navigator>
      <MoreSheet
        visible={isMoreSheetOpen}
        onClose={closeMoreSheet}
        menuItems={moreSheetItems}
      />
    </>
  );
}

const IndividualTabNavigationScreens = () => {
  return (
    <MoreSheetProvider>
      <IndividualTabs />
    </MoreSheetProvider>
  );
};

export default function IndividualNavigation() {
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
        <Stack.Screen
          name={screenName.supportTicketsFilterModal}
          component={wrapWithHighRisk(SupportTicketsFilterModal)}
        />
      </Stack.Group>
      <Stack.Screen
        name={screenName.artwork}
        component={wrapWithHighRisk(Artwork)}
      />
      <Stack.Screen
        name={screenName.arPreview}
        component={wrapWithHighRisk(ArPreview)}
        options={{ presentation: "modal", gestureEnabled: false }}
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
        name={screenName.changePassword}
        component={wrapWithHighRisk(ChangePassword)}
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
        name={screenName.individual.showDetails}
        component={wrapWithHighRisk(ShowDetailsScreen)}
      />
      <Stack.Screen
        name={screenName.individual.fairEventDetails}
        component={wrapWithHighRisk(FairEventDetailsScreen)}
      />
      <Stack.Screen
        name={screenName.individual.galleryDetails}
        component={wrapWithHighRisk(GalleryDetailsScreen)}
      />
      <Stack.Screen
        name={screenName.individual.artistDetails}
        component={wrapWithHighRisk(ArtistDetailsScreen)}
      />
      <Stack.Screen
        name={screenName.individual.allArtists}
        component={wrapWithHighRisk(AllArtistsScreen)}
      />
      <Stack.Screen
        name={screenName.deleteAccount}
        component={wrapWithHighRisk(DeleteAccountScreen)}
      />
      <Stack.Screen
        name={screenName.biometricSettings}
        component={wrapWithHighRisk(BiometricSettings)}
      />
      <Stack.Screen
        name="ViewReceiptScreen"
        component={wrapWithHighRisk(ViewReceiptScreen)}
      />
      <Stack.Screen
        name={screenName.supportTickets}
        component={wrapWithHighRisk(SupportTicketsScreen)}
      />
    </Stack.Navigator>
  );
}
