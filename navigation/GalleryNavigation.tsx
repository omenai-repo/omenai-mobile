import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import { useCallback, useMemo, useRef } from "react";
import Artwork from "#screens/artwork/Artwork";
import Billing from "#screens/billing/Billing";
import Checkout from "#screens/checkout/Checkout";
import GalleryOrder from "#screens/galleryOrder/GalleryOrder";
import ChangeGalleryPassword from "#screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import EditGalleryProfile from "#screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile";
import GetStartedWithStripe from "#screens/stripeScreens/getStartedWithStripe/GetStartedWithStripe";
import UploadArtwork from "#screens/uploadArtwork/UploadArtwork";
import { getAccountID } from "#services/stripe/getAccountID";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import UploadNewLogo from "#screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo";
import ShipmentTrackingScreen from "#screens/artist/orders/ShipmentTrackingScreen";
import DimensionsDetails from "#screens/artist/orders/DimensionsDetails";
import EditAddressScreen from "#screens/editProfile/EditAddressScreen";
import NotificationScreen from "#screens/notifications/NotificationScreen";
import PaymentMethodChangeScreen from "#screens/subscriptions/components/PaymentMethodChangeScreen";
import BillingVerificationScreen from "#screens/subscriptions/components/BillingVerificationScreen";
import EditArtwork from "#screens/editArtwork/EditArtwork";
import DeleteAccountScreen from "#screens/deleteAccount/DeleteAccountScreen";
import { wrapWithHighRisk, wrapWithLowRisk } from "#utils/wrapWithProvider";
import BiometricSettings from "#screens/profile/BiometricSettings";
import SupportTicketsScreen from "#screens/profile/SupportTicketsScreen";
import SupportTicketsFilterModal from "#screens/profile/components/SupportTicketsFilterModal";
import SubscriptionHistory from "#screens/subscriptions/SubscriptionHistory";
import { useQuery } from "@tanstack/react-query";
import GalleryOverviewStack from "#navigation/GalleryOverviewStack";
import GalleryShowsFairsEventsStack from "#navigation/GalleryShowsFairsEventsStack";
import GalleryArtworksListing from "#screens/galleryArtworksListing/GalleryArtworksListing";
import ArtistRoster from "#screens/gallery/artistRoster/ArtistRoster";
import AddArtistToRosterModal from "#screens/gallery/artistRoster/AddArtistToRosterModal";
import ShowsFairsEventDetails from "#screens/gallery/showsFairsEvents/ShowsFairsEventDetails";
import GalleryOrdersListing from "#screens/galleryOrders/GalleryOrdersListing";
import Subscriptions from "#screens/subscriptions/Subscriptions";
import StripePayoutsTab from "#screens/stripeScreens/payouts/StripePayoutsTab";
import GalleryProfile from "#screens/galleryProfileScreens/galleryProfile/GalleryProfile";
import GalleryTabBar from "./components/GalleryTabBar";
import MoreSheet, { type MoreSheetItem } from "./components/MoreSheet";
import { logout } from "#utils/logout.utils";
import {
  MoreSheetProvider,
  useMoreSheet,
} from "./components/MoreSheetContext";
import {
  ordersActive,
  ordersInActive,
  overviewActive,
  overviewInActive,
  profileActive,
  reviewHubActive,
  shippingActive,
  shippingInActive,
  walletActive,
  billingActive,
  billingInActive,
} from "#utils/SvgImages";
import { View } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

const moreLabel = "More";

const galleryTabs = [
  {
    id: 1,
    name: screenName.gallery.overview,
    label: "Overview",
    component: GalleryOverviewStack,
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
  },
  {
    id: 2,
    name: screenName.gallery.artworks,
    label: "Artworks",
    component: GalleryArtworksListing,
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
  },
  {
    id: 3,
    name: screenName.gallery.more,
    label: moreLabel,
    component: () => <View style={{ flex: 1, backgroundColor: "#F7F7F7" }} />,
  },
  {
    id: 4,
    name: screenName.gallery.subscriptions,
    label: "Subscription",
    component: Subscriptions,
    activeIcon: billingActive,
    inActiveIcon: billingInActive,
  },
  {
    id: 5,
    name: screenName.gallery.orders,
    label: "Orders",
    component: GalleryOrdersListing,
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
  },
];

const galleryMoreTabs = [
  {
    id: 6,
    name: screenName.gallery.showsFairsEvents,
    label: "Shows, Fairs & Events",
    component: GalleryShowsFairsEventsStack,
  },
  {
    id: 7,
    name: screenName.gallery.artistRoster,
    label: "Artist Roster",
    component: ArtistRoster,
  },
  {
    id: 8,
    name: screenName.gallery.stripePayouts,
    label: "Payouts",
    component: StripePayoutsTab,
  },
  {
    id: 9,
    name: screenName.gallery.profile,
    label: "Profile",
    component: GalleryProfile,
  },
  {
    id: 10,
    name: screenName.supportTickets,
    label: "Support Tickets",
    component: SupportTicketsScreen,
  },
];

type accountStateType = {
  connected_account_id: string | null;
  gallery_verified: boolean;
};

const allGalleryTabRouteNames = new Set(
  [...galleryTabs, ...galleryMoreTabs].map(({ name }) => name),
);

const moreMenuKeys = new Set([
  "shows-fairs-events",
  "artist-roster",
  "payouts",
  "support-tickets",
  "profile-management",
  "logout",
]);

function buildMoreSheetItems(
  navigateToScreen: (routeName: string) => void,
): MoreSheetItem[] {
  return [
    {
      key: "overview",
      label: "Overview",
      routeName: screenName.gallery.overview,
      icon: overviewActive,
      keywords: ["dashboard", "home"],
      onPress: () => navigateToScreen(screenName.gallery.overview),
    },
    {
      key: "artworks",
      label: "Artworks",
      routeName: screenName.gallery.artworks,
      icon: shippingActive,
      keywords: ["listing", "catalog"],
      onPress: () => navigateToScreen(screenName.gallery.artworks),
    },
    {
      key: "shows-fairs-events",
      label: "Shows, Fairs & Events",
      routeName: screenName.gallery.showsFairsEvents,
      icon: reviewHubActive,
      keywords: ["show", "fair", "events"],
      onPress: () => navigateToScreen(screenName.gallery.showsFairsEvents),
    },
    {
      key: "artist-roster",
      label: "Artist Roster",
      routeName: screenName.gallery.artistRoster,
      expoIconName: "list-outline" as const,
      keywords: ["artists", "roster"],
      onPress: () => navigateToScreen(screenName.gallery.artistRoster),
    },
    {
      key: "orders",
      label: "Orders",
      routeName: screenName.gallery.orders,
      icon: ordersActive,
      keywords: ["shipping", "fulfillment"],
      onPress: () => navigateToScreen(screenName.gallery.orders),
    },
    {
      key: "billing",
      label: "Billing",
      routeName: screenName.gallery.billing,
      icon: billingActive,
      keywords: ["plans", "payments"],
      onPress: () => navigateToScreen(screenName.gallery.billing),
    },
    {
      key: "subscription",
      label: "Subscriptions",
      routeName: screenName.gallery.subscriptions,
      icon: billingActive,
      keywords: ["billing"],
      onPress: () => navigateToScreen(screenName.gallery.subscriptions),
    },
    {
      key: "payouts",
      label: "Payouts",
      routeName: screenName.gallery.stripePayouts,
      icon: walletActive,
      keywords: ["stripe", "withdrawals"],
      onPress: () => navigateToScreen(screenName.gallery.stripePayouts),
    },
    {
      key: "support-tickets",
      label: "Support Tickets",
      routeName: screenName.supportTickets,
      icon: reviewHubActive,
      keywords: ["support", "help"],
      onPress: () => navigateToScreen(screenName.supportTickets),
    },
    {
      key: "profile-management",
      label: "Profile",
      routeName: screenName.gallery.profile,
      icon: profileActive,
      keywords: ["settings", "account"],
      onPress: () => navigateToScreen(screenName.gallery.profile),
    },
    {
      key: "logout",
      label: "Logout",
      routeName: "logout",
      keywords: ["sign out", "log out"],
      isDanger: true,
      onPress: () => void logout(),
    },
  ];
}

function GalleryTabs() {
  const { isMoreSheetOpen, closeMoreSheet, openMoreSheet } = useMoreSheet();
  const tabNavigationRef = useRef<any>(null);

  const navigateToScreen = useCallback((routeName: string) => {
    if (!tabNavigationRef.current) return;
    if (allGalleryTabRouteNames.has(routeName)) {
      tabNavigationRef.current.navigate(routeName);
      return;
    }
    tabNavigationRef.current.getParent()?.navigate(routeName);
  }, []);

  const moreSheetItems = useMemo<MoreSheetItem[]>(
    () => buildMoreSheetItems(navigateToScreen),
    [navigateToScreen],
  );

  const moreMenuItems = useMemo(
    () => moreSheetItems.filter((item) => moreMenuKeys.has(item.key)),
    [moreSheetItems],
  );

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => (
          <>
            {(tabNavigationRef.current = props.navigation, null)}
            <GalleryTabBar
              {...props}
              tabMeta={galleryTabs}
              moreRouteName={screenName.gallery.more}
              onPressMore={openMoreSheet}
            />
          </>
        )}
        screenOptions={{ headerShown: false }}
      >
        {galleryTabs.map(({ name, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{ tabBarShowLabel: false, headerShown: false }}
          />
        ))}
        {galleryMoreTabs.map(({ name, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{
              tabBarShowLabel: false,
              headerShown: false,
            }}
          />
        ))}
      </Tab.Navigator>
      <MoreSheet
        visible={isMoreSheetOpen}
        onClose={closeMoreSheet}
        menuItems={moreMenuItems}
      />
    </>
  );
}

function GalleryTabNavigationScreens() {
  return (
    <MoreSheetProvider>
      <GalleryTabs />
    </MoreSheetProvider>
  );
}

export default function GalleryNavigation() {
  const { data: account } = useQuery({
    queryKey: ["gallery_account_id"],
    queryFn: async (): Promise<accountStateType> => {
      const userSession = await utils_getAsyncData("userSession");
      if (!userSession.value)
        return { connected_account_id: null, gallery_verified: false };

      const res = await getAccountID(JSON.parse(userSession.value).id);
      return {
        connected_account_id: res?.data?.connected_account_id ?? null,
        gallery_verified: res?.data?.gallery_verified ?? false,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  if (account?.connected_account_id === null && account?.gallery_verified)
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="connect-stripe"
          component={GetStartedWithStripe}
          options={hideHeader}
        />
      </Stack.Navigator>
    );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Gallery"
        component={wrapWithHighRisk(GalleryTabNavigationScreens)}
        options={hideHeader}
      />
      <Stack.Screen
        name="ShipmentTrackingScreen"
        component={wrapWithLowRisk(ShipmentTrackingScreen)}
      />
      <Stack.Screen
        name={screenName.artwork}
        component={wrapWithHighRisk(Artwork)}
      />
      <Stack.Screen
        name={"NotificationScreen"}
        component={wrapWithHighRisk(NotificationScreen)}
      />
      <Stack.Screen
        name={screenName.gallery.uploadArtwork}
        component={wrapWithHighRisk(UploadArtwork)}
      />
      <Stack.Screen
        name={screenName.gallery.order}
        component={wrapWithHighRisk(GalleryOrder)}
      />
      <Stack.Screen
        name={screenName.gallery.orders}
        component={wrapWithHighRisk(GalleryOrdersListing)}
      />
      <Stack.Screen
        name={screenName.gallery.showsFairsEventDetails}
        component={wrapWithHighRisk(ShowsFairsEventDetails)}
      />
      <Stack.Screen
        name="DimensionsDetails"
        component={wrapWithHighRisk(DimensionsDetails)}
      />
      <Stack.Screen
        name={screenName.gallery.editProfile}
        component={wrapWithHighRisk(EditGalleryProfile)}
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
        name={screenName.gallery.billing}
        component={wrapWithHighRisk(Billing)}
      />
      <Stack.Screen
        name={"PaymentMethodChangeScreen"}
        component={wrapWithHighRisk(PaymentMethodChangeScreen)}
      />
      <Stack.Screen
        name={screenName.checkout}
        component={wrapWithHighRisk(Checkout)}
      />
      <Stack.Screen
        name={"BillingVerificationScreen"}
        component={wrapWithHighRisk(BillingVerificationScreen)}
      />
      <Stack.Screen
        name={screenName.connectStripe}
        component={wrapWithHighRisk(GetStartedWithStripe)}
      />
      <Stack.Screen
        name={screenName.gallery.editArtwork}
        component={wrapWithHighRisk(EditArtwork)}
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
        name={screenName.supportTickets}
        component={wrapWithHighRisk(SupportTicketsScreen)}
      />
      <Stack.Screen
        name="SubscriptionHistory"
        component={wrapWithHighRisk(SubscriptionHistory)}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name={screenName.gallery.uploadNewLogo}
          component={wrapWithHighRisk(UploadNewLogo)}
        />
        <Stack.Screen
          name={screenName.supportTicketsFilterModal}
          component={wrapWithHighRisk(SupportTicketsFilterModal)}
        />
        <Stack.Screen
          name={screenName.gallery.addArtistToRoster}
          component={wrapWithHighRisk(AddArtistToRosterModal)}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
