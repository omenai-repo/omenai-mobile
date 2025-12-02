import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { screenName } from "constants/screenNames.constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import Artwork from "screens/artwork/Artwork";
import Billing from "screens/billing/Billing";
import Checkout from "screens/checkout/Checkout";
import GalleryOrder from "screens/galleryOrder/GalleryOrder";
import ChangeGalleryPassword from "screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import EditGalleryProfile from "screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile";
import GetStartedWithStripe from "screens/stripeScreens/getStartedWithStripe/GetStartedWithStripe";
import Subscriptions from "screens/subscriptions/Subscriptions";
import UploadArtwork from "screens/uploadArtwork/UploadArtwork";
import { getAccountID } from "services/stripe/getAccountID";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import UploadNewLogo from "screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo";
import ShipmentTrackingScreen from "screens/artist/orders/ShipmentTrackingScreen";
import DimensionsDetails from "screens/artist/orders/DimensionsDetails";
import EditAddressScreen from "screens/editProfile/EditAddressScreen";
import { BottomTabDataGallery } from "utils/BottomTabData";
import CustomTabBar from "./components/TabButton";
import NotificationScreen from "screens/notifications/NotificationScreen";
import PaymentMethodChangeScreen from "screens/subscriptions/components/PaymentMethodChangeScreen";
import BillingVerificationScreen from "screens/subscriptions/components/BillingVerificationScreen";
import EditArtwork from "screens/editArtwork/EditArtwork";
import DeleteAccountScreen from "screens/deleteAccount/DeleteAccountScreen";
import { wrapWithHighRisk, wrapWithLowRisk } from "utils/wrapWithProvider";
import BiometricSettings from "screens/profile/BiometricSettings";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

type accountStateType = {
  connected_account_id: string | null;
  gallery_verified: boolean;
};

export default function GalleryNavigation() {
  const [account, setAccount] = useState<accountStateType>({
    connected_account_id: null,
    gallery_verified: false,
  });

  useEffect(() => {
    handleGetAccountID();
  }, []);

  async function handleGetAccountID() {
    const userSession = await utils_getAsyncData("userSession");
    if (!userSession.value) return;

    const res = await getAccountID(JSON.parse(userSession.value).id);
    if (!res?.data) return;

    setAccount((prev) => {
      const next = {
        connected_account_id: res.data.connected_account_id,
        gallery_verified: res.data.gallery_verified,
      };
      // avoid needless re-renders (tab remount) if nothing changed
      if (
        prev.connected_account_id === next.connected_account_id &&
        prev.gallery_verified === next.gallery_verified
      ) {
        return prev;
      }
      return next;
    });
  }

  const tabs = useMemo(
    () => BottomTabDataGallery(account),
    [account.connected_account_id, account.gallery_verified]
  );

  const GalleryTabNavigationScreens = useCallback(() => {
    return (
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} tabData={tabs} />}
        screenOptions={{ headerShown: false }}
      >
        {tabs.map(({ name, component, id, initialParams }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            initialParams={initialParams}
            options={{ tabBarShowLabel: false }}
          />
        ))}
      </Tab.Navigator>
    );
  }, [tabs]);

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
        name={screenName.gallery.subscriptions}
        component={wrapWithHighRisk(Subscriptions)}
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
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name={screenName.gallery.uploadNewLogo}
          component={wrapWithHighRisk(UploadNewLogo)}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
