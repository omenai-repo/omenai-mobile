import { Feather, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { colors } from 'config/colors.config';
import { screenName } from 'constants/screenNames.constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Artwork from 'screens/artwork/Artwork';
import Billing from 'screens/billing/Billing';
import Checkout from 'screens/checkout/Checkout';
import GalleryOrder from 'screens/galleryOrder/GalleryOrder';
import ChangeGalleryPassword from 'screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword';
import EditGalleryProfile from 'screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile';
import GetStartedWithStripe from 'screens/stripeScreens/getStartedWithStripe/GetStartedWithStripe';
import Subscriptions from 'screens/subscriptions/Subscriptions';
import UploadArtwork from 'screens/uploadArtwork/UploadArtwork';
import { getAccountID } from 'services/stripe/getAccountID';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { useNavigation } from '@react-navigation/native';
import StripePayouts from 'screens/stripeScreens/payouts/StripePayouts';
import EditArtwork from 'screens/editArtwork/EditArtwork';
import UploadNewLogo from 'screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo';
import VerifyTransaction from 'screens/verifyTransaction/VerifyTransaction';
import ChangeCard from 'screens/subscriptions/changeCard/ChangeCard';
import ShipmentTrackingScreen from 'screens/artist/orders/ShipmentTrackingScreen';
import DimentionsDetails from 'screens/artist/orders/DimentionsDetails';
import EditAddressScreen from 'screens/editProfile/EditAddressScreen';
import { BottomTabDataGallery } from 'utils/BottomTabData';
import CustomTabBar from './components/TabButton';
import NotificationScreen from 'screens/notifications/NotificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

type accountStateType = {
  connected_account_id: string | null;
  gallery_verified: boolean;
};

export default function GalleryNavigation() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const prevRouteRef = useRef<string | null>(null);

  const [account, setAccount] = useState<accountStateType>({
    connected_account_id: null,
    gallery_verified: false,
  });

  useEffect(() => {
    handleGetAccountID();
  }, []);

  async function handleGetAccountID() {
    const userSession = await utils_getAsyncData('userSession');
    if (!userSession.value) return;

    const res = await getAccountID(JSON.parse(userSession.value).email);
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
    [account.connected_account_id, account.gallery_verified],
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
        <Stack.Screen name="connect-stripe" component={GetStartedWithStripe} options={hideHeader} />
      </Stack.Navigator>
    );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Gallery" component={GalleryTabNavigationScreens} options={hideHeader} />
      <Stack.Screen name={screenName.artwork} component={Artwork} />
      <Stack.Screen name={'NotificationScreen'} component={NotificationScreen} />
      <Stack.Screen name={screenName.gallery.uploadArtwork} component={UploadArtwork} />
      <Stack.Screen name={screenName.gallery.order} component={GalleryOrder} />
      <Stack.Screen name="ShipmentTrackingScreen" component={ShipmentTrackingScreen} />
      <Stack.Screen name="DimentionsDetails" component={DimentionsDetails} />
      <Stack.Screen name={screenName.gallery.editProfile} component={EditGalleryProfile} />
      <Stack.Screen name={'EditAddressScreen'} component={EditAddressScreen} />
      <Stack.Screen name={screenName.gallery.changePassword} component={ChangeGalleryPassword} />
      <Stack.Screen name={screenName.gallery.subscriptions} component={Subscriptions} />
      <Stack.Screen name={screenName.gallery.billing} component={Billing} />
      <Stack.Screen name={screenName.checkout} component={Checkout} />
      <Stack.Screen name={screenName.connectStripe} component={GetStartedWithStripe} />
      <Stack.Screen name={screenName.gallery.editArtwork} component={EditArtwork} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name={screenName.gallery.uploadNewLogo} component={UploadNewLogo} />
      </Stack.Group>
      <Stack.Screen name={screenName.gallery.changeBillingCard} component={ChangeCard} />
      <Stack.Screen name={screenName.verifyTransaction} component={VerifyTransaction} />
    </Stack.Navigator>
  );
}
