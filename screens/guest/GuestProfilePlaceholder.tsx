import React, { useEffect } from "react";
import { View } from "react-native";
import { useGuestLoginModalStore } from "#store/account/guest/guestLoginModalStore";
import { screenName } from "#constants/screenNames.constants";
import { useNavigation } from "@react-navigation/native";

export default function GuestProfilePlaceholder() {
  const { openGuestLoginModal } = useGuestLoginModalStore();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      openGuestLoginModal({ screen: screenName.profile });
      // Bounce back to overview so the tab bar doesn't get stuck visually on the "Profile" tab
      navigation.navigate("Overview");
    });
    return unsubscribe;
  }, [navigation, openGuestLoginModal]);

  return <View />;
}
