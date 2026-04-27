import { View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import omenaiLogo from "../../assets/omenai-logo.png";
import tailwind from "twrnc";
import { useGuestLoginModalStore } from "#store/guest/guestLoginModalStore";
import { colors } from "#config/colors.config";

export function GalleryOverviewLogo() {
  return (
    <Image
      source={omenaiLogo}
      style={tailwind`w-[112px] h-[24px]`}
      contentFit="contain"
      cachePolicy="none"
    />
  );
}

export function GalleryOverviewNotificationButton() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NotificationScreen")}
      activeOpacity={0.7}
    >
      <View
        style={tailwind`bg-[#f0f0f0] h-[40px] w-[40px] rounded-full flex items-center justify-center`}
      >
        <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(function Header({
  showNotification = true,
  showAuthButton = false,
}: {
  showNotification?: boolean;
  showAuthButton?: boolean;
}) {
  const { openGuestLoginModal } = useGuestLoginModalStore();

  return (
    <View
      style={tailwind`flex-row items-center self-center gap-5`}
    >
      <View style={tailwind`flex-1`}>
        <GalleryOverviewLogo />
      </View>

      {showNotification && <GalleryOverviewNotificationButton />}

      {showAuthButton && (
        <TouchableOpacity
          style={[
            tailwind`px-4 py-2 rounded-sm`,
            { backgroundColor: colors.black },
          ]}
          onPress={() => openGuestLoginModal()}
        >
          <Text style={tailwind`text-white text-xs font-sans-medium`}>
            Log in
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
