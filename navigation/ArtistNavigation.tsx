import { View, Text, Modal, Animated, Easing, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "#store/app/appStore";
import ArtistOnboarding from "#screens/artistOnboarding/ArtistOnboarding";
import tw from "twrnc";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SvgXml } from "react-native-svg";
import {
  starEffect,
  ordersActive,
  ordersInActive,
  overviewActive,
  overviewInActive,
  profileActive,
  reviewHubActive,
  walletActive,
  walletInActive,
  shippingActive,
  shippingInActive,
} from "#utils/SvgImages";
import ArtistOverviewStack from "#navigation/ArtistOverviewStack";
import { createStackNavigator } from "@react-navigation/stack";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { logout } from "#utils/logout.utils";
import { BlurView } from "expo-blur";
import OrderScreen from "#screens/artist/orders/OrderScreen";
import DimensionsDetails from "#screens/artist/orders/DimensionsDetails";
import WalletHistory from "#screens/artist/wallet/WalletHistory";
import AddPrimaryAcctScreen from "#screens/artist/wallet/AddPrimaryAcctScreen";
import { screenName } from "#constants/screenNames.constants";
import EditGalleryProfile from "#screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile";
import ChangeGalleryPassword from "#screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import UploadNewLogo from "#screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo";
import EditCredentialsScreen from "#screens/artist/profile/EditCredentialsScreen";
import UploadArtwork from "#screens/uploadArtwork/UploadArtwork";
import ProposalPriceScreen from "#screens/uploadArtwork/ProposalPriceScreen";
import { WithdrawScreen } from "#screens/artist/wallet/WithdrawScreen";
import { ForgotPinScreen } from "#screens/artist/wallet/ForgotPinScreen";
import { ResetPinScreen } from "#screens/artist/wallet/ResetPinScreen";
import { WithdrawalSuccess } from "#screens/artist/wallet/WithdarwalSuccess";
import { TransactionDetailsScreen } from "#screens/artist/wallet/TransactionDetailsScreen";
import Artwork from "#screens/artwork/Artwork";
import EditArtwork from "#screens/editArtwork/EditArtwork";
import ShipmentTrackingScreen from "#screens/artist/orders/ShipmentTrackingScreen";
import EditAddressScreen from "#screens/editProfile/EditAddressScreen";
import ViewCredentialsScreen from "#screens/artist/profile/ViewCredentials";
import GalleryTabBar from "./components/GalleryTabBar";
import NotificationScreen from "#screens/notifications/NotificationScreen";
import DeleteAccountScreen from "#screens/deleteAccount/DeleteAccountScreen";
import { wrapWithHighRisk, wrapWithLowRisk } from "#utils/wrapWithProvider";
import BiometricSettings from "#screens/profile/BiometricSettings";
import SupportTicketsScreen from "#screens/profile/SupportTicketsScreen";
import SupportTicketsFilterModal from "#screens/profile/components/SupportTicketsFilterModal";
import MoreSheet, { type MoreSheetItem } from "./components/MoreSheet";
import {
  MoreSheetProvider,
  useMoreSheet,
} from "./components/MoreSheetContext";
import ArtistReviewHub from "#screens/artist/reviews/ArtistReviewHub";
import ArtistProfileScreen from "#screens/artist/profile/ArtistProfileScreen";
import WalletScreen from "#screens/artist/wallet/WalletScreen";
import GalleryArtworksListing from "#screens/galleryArtworksListing/GalleryArtworksListing";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const moreLabel = "More";

const artistTabs = [
  {
    id: 1,
    name: "Overview",
    label: "Overview",
    component: ArtistOverviewStack,
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
  },
  {
    id: 2,
    name: "Wallet",
    label: "Wallet",
    component: WalletScreen,
    activeIcon: walletActive,
    inActiveIcon: walletInActive,
  },
  {
    id: 3,
    name: "artist-more",
    label: moreLabel,
    component: () => <View style={{ flex: 1, backgroundColor: "#F7F7F7" }} />,
  },
  {
    id: 4,
    name: "Artworks",
    label: "Artworks",
    component: GalleryArtworksListing,
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
  },
  {
    id: 5,
    name: "Orders",
    label: "Orders",
    component: OrderScreen,
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
  },
];

const artistMoreTabs = [
  {
    id: 6,
    name: "Review",
    label: "Review",
    component: ArtistReviewHub,
  },
  {
    id: 7,
    name: "Profile",
    label: "Profile",
    component: ArtistProfileScreen,
  },
  {
    id: 8,
    name: screenName.supportTickets,
    label: "Support Tickets",
    component: SupportTicketsScreen,
  },
];

const BottomTabNav = () => {
  const { userSession } = useAppStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const { isMoreSheetOpen, closeMoreSheet, openMoreSheet } = useMoreSheet();
  const tabNavigationRef = useRef<any>(null);

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

  const navigateToScreen = (routeName: string) => {
    if (!tabNavigationRef.current) return;
    const tabRouteNames = [...artistTabs, ...artistMoreTabs].map(
      ({ name }) => name,
    );
    if (tabRouteNames.includes(routeName)) {
      tabNavigationRef.current.navigate(routeName);
      return;
    }
    tabNavigationRef.current.getParent()?.navigate(routeName);
  };

  const moreSheetItems: MoreSheetItem[] = [
    {
      key: "review",
      label: "Review",
      routeName: "Review",
      icon: reviewHubActive,
      keywords: ["ratings", "feedback"],
      onPress: () => navigateToScreen("Review"),
    },
    {
      key: "profile",
      label: "Profile",
      routeName: "Profile",
      icon: profileActive,
      keywords: ["account", "settings"],
      onPress: () => navigateToScreen("Profile"),
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
      key: "logout",
      label: "Logout",
      routeName: "logout",
      keywords: ["sign out", "log out"],
      isDanger: true,
      onPress: () => void logout(),
    },
  ];

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => (
          <>
            {(tabNavigationRef.current = props.navigation, null)}
            <GalleryTabBar
              {...props}
              tabMeta={artistTabs}
              moreRouteName="artist-more"
              onPressMore={openMoreSheet}
            />
          </>
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        {artistTabs.map(({ name, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{
              tabBarShowLabel: false,
            }}
          />
        ))}
        {artistMoreTabs.map(({ name, component, id }) => (
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
      <MoreSheet
        visible={isMoreSheetOpen}
        onClose={closeMoreSheet}
        menuItems={moreSheetItems}
      />

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={tw`flex-1 bg-[#0003] justify-center items-center`}>
          <BlurView
            intensity={30}
            style={tw`absolute top-0 left-0 right-0 bottom-0`}
          />
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                tw`bg-[#FFFFFF] rounded-sm py-[35px]`,
                {
                  marginHorizontal: "5%",
                  opacity: fadeAnim, // Apply fade animation
                  transform: [{ scale: scaleAnim }], // Apply scale animation
                },
              ]}
            >
              <View style={tw`flex-row self-center gap-[20px]`}>
                <SvgXml
                  xml={starEffect}
                  style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text style={tw`text-[18px] text-[#1A1A1A] font-bold`}>
                  Verification in progress
                </Text>
                <SvgXml xml={starEffect} />
              </View>

              <Text
                style={tw`text-[16px] leading-[25px] text-[#1A1A1A]00099] text-center mx-[40px]`}
              >
                Your profile is currently under verification, which typically
                takes 24 to 48 hours. You will receive an update via email
                within this timeframe. We appreciate your patience.
              </Text>
              <View style={tw`mt-[30px] mx-[30px]`}>
                <FittedBlackButton onClick={logout} value="Logout" />
              </View>
            </Animated.View>
          </Pressable>
        </View>
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
      <Stack.Screen
        name="Artist"
        component={wrapWithHighRisk(() => (
          <MoreSheetProvider>
            <BottomTabNav />
          </MoreSheetProvider>
        ))}
      />
      <Stack.Screen
        name="ShipmentTrackingScreen"
        component={wrapWithLowRisk(ShipmentTrackingScreen)}
      />
      <Stack.Screen
        name="ArtistOnboarding"
        component={wrapWithHighRisk(ArtistOnboarding)}
      />
      <Stack.Screen
        name="ArtistOverview"
        component={wrapWithHighRisk(ArtistOverviewStack)}
      />
      <Stack.Screen
        name={"NotificationScreen"}
        component={wrapWithHighRisk(NotificationScreen)}
      />
      <Stack.Screen
        name="OrderScreen"
        component={wrapWithHighRisk(OrderScreen)}
      />
      <Stack.Screen
        name="DimensionsDetails"
        component={wrapWithHighRisk(DimensionsDetails)}
      />
      <Stack.Screen
        name="WalletHistory"
        component={wrapWithHighRisk(WalletHistory)}
      />
      <Stack.Screen
        name="AddPrimaryAcctScreen"
        component={wrapWithHighRisk(AddPrimaryAcctScreen)}
      />
      <Stack.Screen
        name={"WithdrawScreen"}
        component={wrapWithHighRisk(WithdrawScreen)}
      />
      <Stack.Screen
        name={"ForgotPinScreen"}
        component={wrapWithHighRisk(ForgotPinScreen)}
      />
      <Stack.Screen
        name={"ResetPinScreen"}
        component={wrapWithHighRisk(ResetPinScreen)}
      />
      <Stack.Screen
        name={"WithdrawalSuccess"}
        component={wrapWithHighRisk(WithdrawalSuccess)}
      />
      <Stack.Screen
        name={"TransactionDetailsScreen"}
        component={wrapWithHighRisk(TransactionDetailsScreen)}
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
        name={"EditCredentialsScreen"}
        component={wrapWithHighRisk(EditCredentialsScreen)}
      />
      <Stack.Screen
        name={"ViewCredentialsScreen"}
        component={wrapWithHighRisk(ViewCredentialsScreen)}
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
      </Stack.Group>
      <Stack.Screen
        name={screenName.gallery.uploadArtwork}
        component={wrapWithHighRisk(UploadArtwork)}
      />
      <Stack.Screen
        name={screenName.artist.proposalPrice}
        component={wrapWithHighRisk(ProposalPriceScreen)}
      />
      <Stack.Screen
        name={screenName.artwork}
        component={wrapWithHighRisk(Artwork)}
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
    </Stack.Navigator>
  );
};

export default ArtistNavigation;
