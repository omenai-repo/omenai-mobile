import { Feather, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationState } from "react-navigation";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { colors } from "config/colors.config";
import { screenName } from "constants/screenNames.constants";
import { useEffect, useRef, useState } from "react";
import { Platform, Text, View, useWindowDimensions } from "react-native";
import Artwork from "screens/artwork/Artwork";
import Billing from "screens/billing/Billing";
import Checkout from "screens/checkout/Checkout";
import GalleryArtworksListing from "screens/galleryArtworksListing/GalleryArtworksListing";
import GalleryOrder from "screens/galleryOrder/GalleryOrder";
import GalleryOrdersListing from "screens/galleryOrders/GalleryOrdersListing";
import ChangeGalleryPassword from "screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import EditGalleryProfile from "screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile";
import GalleryProfile from "screens/galleryProfileScreens/galleryProfile/GalleryProfile";
import Overview from "screens/overview/Overview";
import GetStartedWithStripe from "screens/stripeScreens/getStartedWithStripe/GetStartedWithStripe";
import Subscriptions from "screens/subscriptions/Subscriptions";
import UploadArtwork from "screens/uploadArtwork/UploadArtwork";
import { getAccountID } from "services/stripe/getAccountID";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { useNavigation } from "@react-navigation/native";
import StripePayouts from "screens/stripeScreens/payouts/StripePayouts";
import EditArtwork from "screens/editArtwork/EditArtwork";
import UploadNewLogo from "screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo";
import VerifyTransaction from "screens/verifyTransaction/VerifyTransaction";
import ChangeCard from "screens/subscriptions/changeCard/ChangeCard";

type CustomTabBarIconProps = {
  name: any;
  focused: boolean;
  title: string;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

type accountStateType = {
  connected_account_id: string | null;
  gallery_verified: boolean;
};

export default function GalleryNavigation() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const prevRouteRef = useRef(null);

  const [account, setAccount] = useState<accountStateType>({
    connected_account_id: null,
    gallery_verified: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      const currentRoute = e.data.state?.routes[e.data.state.index].name;

      if (currentRoute !== prevRouteRef.current) {
        handleGetAccountID();
        prevRouteRef.current = currentRoute;
      }
    });

    return unsubscribe;
  }, [navigation]);

  async function handleGetAccountID() {
    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      const res = await getAccountID(JSON.parse(userSession.value).email);
      if (res?.data) {
        setAccount({
          connected_account_id: res.data.connected_account_id,
          gallery_verified: res.data.gallery_verified,
        });
      }
    }
    return;
  }

  const CustomTabBarIcon = ({
    name,
    focused,
    title,
  }: CustomTabBarIconProps) => {
    let icon = (
      <Ionicons
        name={name}
        size={focused ? 25 : 22}
        color={focused ? colors.white : colors.grey}
      />
    );
    if (
      title === screenName.gallery.orders ||
      title === screenName.gallery.profile
    ) {
      icon = (
        <Feather
          name={name}
          size={focused ? 25 : 22}
          color={focused ? colors.white : colors.grey}
        />
      );
    }

    return <View style={{ alignItems: "center", gap: 5 }}>{icon}</View>;
  };

  const StripePayoutScreen = () => {
    return (
      <StripePayouts
        showScreen={
          account.connected_account_id !== null && account.gallery_verified
        }
        account_id={account.connected_account_id || ""}
      />
    );
  };

  const GalleryTabNavigationScreens = () => {
    const { width } = useWindowDimensions();
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName = "";

            if (route.name === screenName.gallery.overview) {
              iconName = "grid-outline";
            } else if (route.name === screenName.gallery.artworks) {
              iconName = "briefcase-outline";
            } else if (route.name === screenName.gallery.orders) {
              iconName = "package";
            } else if (route.name === screenName.gallery.profile) {
              iconName = "user";
            } else if (route.name === screenName.gallery.subscriptions) {
              iconName = "card-outline";
            } else if (route.name === screenName.gallery.stripePayouts) {
              iconName = "wallet-outline";
            }

            return (
              <CustomTabBarIcon
                title={route.name}
                name={iconName}
                focused={focused}
              />
            );
          },
          tabBarLabel: () => null,
          tabBarActiveTintColor: colors.primary_black,
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
        <Tab.Screen component={Overview} name={screenName.gallery.overview} />
        <Tab.Screen
          component={GalleryArtworksListing}
          name={screenName.gallery.artworks}
        />
        <Tab.Screen
          component={GalleryOrdersListing}
          name={screenName.gallery.orders}
        />
        <Tab.Screen
          component={Subscriptions}
          name={screenName.gallery.subscriptions}
        />
        <Tab.Screen
          component={StripePayoutScreen}
          name={screenName.gallery.stripePayouts}
        />
        <Tab.Screen
          component={GalleryProfile}
          name={screenName.gallery.profile}
        />
      </Tab.Navigator>
    );
  };

  if (account.connected_account_id === null && account.gallery_verified)
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
        component={GalleryTabNavigationScreens}
        options={hideHeader}
      />
      <Stack.Screen name={screenName.artwork} component={Artwork} />
      <Stack.Screen
        name={screenName.gallery.uploadArtwork}
        component={UploadArtwork}
      />
      <Stack.Screen name={screenName.gallery.order} component={GalleryOrder} />
      <Stack.Screen
        name={screenName.gallery.editProfile}
        component={EditGalleryProfile}
      />
      <Stack.Screen
        name={screenName.gallery.changePassword}
        component={ChangeGalleryPassword}
      />
      <Stack.Screen
        name={screenName.gallery.subscriptions}
        component={Subscriptions}
      />
      <Stack.Screen name={screenName.gallery.billing} component={Billing} />
      <Stack.Screen name={screenName.checkout} component={Checkout} />
      <Stack.Screen
        name={screenName.connectStripe}
        component={GetStartedWithStripe}
      />
      <Stack.Screen
        name={screenName.gallery.editArtwork}
        component={EditArtwork}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name={screenName.gallery.uploadNewLogo}
          component={UploadNewLogo}
        />
      </Stack.Group>
      <Stack.Screen
        name={screenName.gallery.changeBillingCard}
        component={ChangeCard}
      />
      <Stack.Screen
        name={screenName.verifyTransaction}
        component={VerifyTransaction}
      />
    </Stack.Navigator>
  );
}
