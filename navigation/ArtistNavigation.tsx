import { View, Text, Modal, Animated, Easing, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "store/app/appStore";
import ArtistOnboarding from "screens/artistOnboarding/ArtistOnboarding";
import tw from "twrnc";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SvgXml } from "react-native-svg";
import { starEffect } from "utils/SvgImages";
import ArtistOverview from "screens/artist/overview/ArtistOverview";
import { createStackNavigator } from "@react-navigation/stack";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { logout } from "utils/logout.utils";
import { BlurView } from "expo-blur";
import OrderScreen from "screens/artist/orders/OrderScreen";
import DimensionsDetails from "screens/artist/orders/DimensionsDetails";
import WalletHistory from "screens/artist/wallet/WalletHistory";
import AddPrimaryAcctScreen from "screens/artist/wallet/AddPrimaryAcctScreen";
import { screenName } from "constants/screenNames.constants";
import EditGalleryProfile from "screens/galleryProfileScreens/editGalleryProfile/EditGalleryProfile";
import ChangeGalleryPassword from "screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword";
import UploadNewLogo from "screens/galleryProfileScreens/uploadNewLogo/UploadNewLogo";
import EditCredentialsScreen from "screens/artist/profile/EditCredentialsScreen";
import UploadArtwork from "screens/uploadArtwork/UploadArtwork";
import { WithdrawScreen } from "screens/artist/wallet/WithdrawScreen";
import { ForgotPinScreen } from "screens/artist/wallet/ForgotPinScreen";
import { ResetPinScreen } from "screens/artist/wallet/ResetPinScreen";
import { WithdrawalSuccess } from "screens/artist/wallet/WithdarwalSuccess";
import { TransactionDetailsScreen } from "screens/artist/wallet/TransactionDetailsScreen";
import Artwork from "screens/artwork/Artwork";
import EditArtwork from "screens/editArtwork/EditArtwork";
import ShipmentTrackingScreen from "screens/artist/orders/ShipmentTrackingScreen";
import { BottomTabDataArtist } from "utils/BottomTabData";
import EditAddressScreen from "screens/editProfile/EditAddressScreen";
import ViewCredentialsScreen from "screens/artist/profile/ViewCredentials";
import CustomTabBar from "./components/TabButton";
import NotificationScreen from "screens/notifications/NotificationScreen";
import DeleteAccountScreen from "screens/deleteAccount/DeleteAccountScreen";
import { wrapWithHighRisk, wrapWithLowRisk } from "utils/wrapWithProvider";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} tabData={BottomTabDataArtist} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {BottomTabDataArtist.map(({ name, component, id }) => (
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
                  marginHorizontal: "5%",
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

              <Text
                style={tw`text-[16px] leading-[25px] text-[#1A1A1A]00099] text-center mx-[40px]`}
              >
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
      <Stack.Screen name="Artist" component={wrapWithHighRisk(BottomTabNav)} />
      <Stack.Screen
        name="ShipmentTrackingScreen"
        component={wrapWithLowRisk(ShipmentTrackingScreen)}
      />
      <Stack.Screen name="ArtistOnboarding" component={wrapWithHighRisk(ArtistOnboarding)} />
      <Stack.Screen name="ArtistOverview" component={wrapWithHighRisk(ArtistOverview)} />
      <Stack.Screen name={"NotificationScreen"} component={wrapWithHighRisk(NotificationScreen)} />
      <Stack.Screen name="OrderScreen" component={wrapWithHighRisk(OrderScreen)} />
      <Stack.Screen name="DimensionsDetails" component={wrapWithHighRisk(DimensionsDetails)} />
      <Stack.Screen name="WalletHistory" component={wrapWithHighRisk(WalletHistory)} />
      <Stack.Screen
        name="AddPrimaryAcctScreen"
        component={wrapWithHighRisk(AddPrimaryAcctScreen)}
      />
      <Stack.Screen name={"WithdrawScreen"} component={wrapWithHighRisk(WithdrawScreen)} />
      <Stack.Screen name={"ForgotPinScreen"} component={wrapWithHighRisk(ForgotPinScreen)} />
      <Stack.Screen name={"ResetPinScreen"} component={wrapWithHighRisk(ResetPinScreen)} />
      <Stack.Screen name={"WithdrawalSuccess"} component={wrapWithHighRisk(WithdrawalSuccess)} />
      <Stack.Screen
        name={"TransactionDetailsScreen"}
        component={wrapWithHighRisk(TransactionDetailsScreen)}
      />
      <Stack.Screen
        name={screenName.gallery.editProfile}
        component={wrapWithHighRisk(EditGalleryProfile)}
      />
      <Stack.Screen name={"EditAddressScreen"} component={wrapWithHighRisk(EditAddressScreen)} />
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
      </Stack.Group>
      <Stack.Screen
        name={screenName.gallery.uploadArtwork}
        component={wrapWithHighRisk(UploadArtwork)}
      />
      <Stack.Screen name={screenName.artwork} component={wrapWithHighRisk(Artwork)} />
      <Stack.Screen
        name={screenName.gallery.editArtwork}
        component={wrapWithHighRisk(EditArtwork)}
      />
      <Stack.Screen
        name={screenName.deleteAccount}
        component={wrapWithHighRisk(DeleteAccountScreen)}
      />
    </Stack.Navigator>
  );
};

export default ArtistNavigation;
