import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  GestureResponderEvent,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from 'store/app/appStore';
import ArtistOnboarding from 'screens/artistOnboarding/ArtistOnboarding';
import tw from 'twrnc';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import {
  ordersActive,
  ordersInActive,
  overviewActive,
  overviewInActive,
  profileActive,
  profileInActive,
  shippingActive,
  shippingInActive,
  starEffect,
  walletActive,
  walletInActive,
} from 'utils/SvgImages';
import ArtistOverview from 'screens/artist/overview/ArtistOverview';
import { colors } from 'config/colors.config';
import { createStackNavigator } from '@react-navigation/stack';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { logout } from 'utils/logout.utils';
import { BlurView } from 'expo-blur';
import OrderScreen from 'screens/artist/orders/OrderScreen';
import DimentionsDetails from 'screens/artist/orders/DimentionsDetails';
import WalletScreen from 'screens/artist/wallet/WalletScreen';
import WalletHistory from 'screens/artist/wallet/WalletHistory';
import AddPrimaryAcctScreen from 'screens/artist/wallet/AddPrimaryAcctScreen';
import ArtistProfileScreen from 'screens/artist/profile/ArtistProfileScreen';
import { screenName } from 'constants/screenNames.constants';
import EditGalleryProfile from 'screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile';
import ChangeGalleryPassword from 'screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword';
import UploadNewLogo from 'screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo';
import UploadArtworkScreen from 'screens/artist/UploadArtwork/UploadArtworkScreen';
import EditCredentialsScreen from 'screens/artist/profile/EditCredentialsScreen';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabData = [
  {
    id: 1,
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
    name: 'Overview',
    component: ArtistOverview,
  },
  {
    id: 2,
    activeIcon: walletActive,
    inActiveIcon: walletInActive,
    name: 'Wallet',
    component: WalletScreen,
  },
  {
    id: 2,
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
    name: 'Orders',
    component: OrderScreen,
  },
  {
    id: 2,
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
    name: 'Art Upload',
    component: UploadArtworkScreen,
  },
  {
    id: 2,
    activeIcon: profileActive,
    inActiveIcon: profileInActive,
    name: 'Profile',
    component: ArtistProfileScreen,
  },
];

const BottomTabNav = () => {
  const { userSession } = useAppStore();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!userSession.artist_verified) {
      setModalVisible(true);
    }
  }, [userSession.artist_verified]);

  const fadeAnim = useRef(new Animated.Value(0)).current; // Start opacity at 0
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Start scale at 0.5

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale up to normal
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const TabButton = ({
    name,
    activeIcon,
    inActiveIcon,
    accessibilityState,
    onPress,
  }: {
    name: string;
    activeIcon: string;
    inActiveIcon: string;
    accessibilityState?: any;
    onPress?: (event: GestureResponderEvent) => void;
  }) => {
    const focused = accessibilityState?.selected;
    return (
      <TouchableOpacity
        onPress={(event) => onPress?.(event)}
        activeOpacity={1}
        style={tw`items-center flex-1 justify-center`}
      >
        <SvgXml xml={focused ? activeIcon : inActiveIcon} />
        <Text
          style={[
            { fontSize: 13, color: colors.grey, fontWeight: '700', marginTop: 10 },
            focused && { color: colors.white },
          ]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 85,
            backgroundColor: colors.black,
            bottom: 30,
            borderRadius: 18,
            marginHorizontal: width / 20,
            position: 'absolute',
            paddingTop: Platform.OS === 'ios' ? 25 : 0,
          },
        }}
      >
        {BottomTabData.map(({ name, activeIcon, inActiveIcon, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => (
                <TabButton
                  {...props}
                  activeIcon={activeIcon}
                  inActiveIcon={inActiveIcon}
                  name={name}
                />
              ),
            }}
          />
        ))}
      </Tab.Navigator>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <Pressable
          onPressOut={() => setModalVisible(false)}
          style={tw`flex-1 bg-[#0003] justify-center items-center`}
        >
          <BlurView intensity={30} style={tw`absolute top-0 left-0 right-0 bottom-0`} />
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                tw`bg-[#FFFFFF] rounded-[20px] py-[35px]`,
                {
                  marginHorizontal: '5%',
                  opacity: fadeAnim, // Apply fade animation
                  transform: [{ scale: scaleAnim }], // Apply scale animation
                },
              ]}
            >
              <View style={tw`flex-row self-center gap-[20px]`}>
                <SvgXml xml={starEffect} style={{ transform: [{ scaleX: -1 }] }} />
                <Text style={tw`text-[18px] text-[#1A1A1A] font-bold`}>
                  Verification in progress
                </Text>
                <SvgXml xml={starEffect} />
              </View>

              <Text style={tw`text-[16px] leading-[25px] text-[#00000099] text-center mx-[40px]`}>
                Your profile is currently under verification, which typically takes 24 to 48 hours.
                You will receive an update via email within this timeframe. We appreciate your
                patience.
              </Text>
              <View style={tw`mt-[30px] mx-[30px]`}>
                <FittedBlackButton onClick={logout} value="Logout" />
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const ArtistNavigation = () => {
  const { userSession } = useAppStore();

  if (userSession.isOnboardingCompleted === false) {
    return <ArtistOnboarding />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen name="ArtistOnboarding" component={ArtistOnboarding} />
      <Stack.Screen name="ArtistOverview" component={ArtistOverview} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="DimentionsDetails" component={DimentionsDetails} />
      <Stack.Screen name="WalletHistory" component={WalletHistory} />
      <Stack.Screen name="AddPrimaryAcctScreen" component={AddPrimaryAcctScreen} />
      <Stack.Screen name={screenName.gallery.editProfile} component={EditGalleryProfile} />
      <Stack.Screen name={screenName.gallery.changePassword} component={ChangeGalleryPassword} />
      <Stack.Screen name={'EditCredentialsScreen'} component={EditCredentialsScreen} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name={screenName.gallery.uploadNewLogo} component={UploadNewLogo} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ArtistNavigation;
