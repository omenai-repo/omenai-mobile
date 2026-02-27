import { Image, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import omenaiLogo from "../../assets/omenai-logo.png";
import tailwind from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGuestLoginModalStore } from "#store/guest/guestLoginModalStore";
import { colors } from "#config/colors.config";

export default function Header({
  showNotification = true,
  showAuthButton = false,
}: {
  showNotification?: boolean;
  showAuthButton?: boolean;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { openGuestLoginModal } = useGuestLoginModalStore();

  const handleNotificationPress = () => {
    navigation.navigate("NotificationScreen");
  };

  return (
    <View
      style={[
        tailwind`flex-row items-center px-5 self-center gap-5`,
        { marginTop: insets.top + 16 },
      ]}
    >
      <View style={tailwind`flex-1`}>
        <Image
          style={tailwind`w-[130px] h-[30px]`}
          resizeMode="contain"
          source={omenaiLogo}
        />
      </View>

      {showNotification && (
        <TouchableOpacity onPress={handleNotificationPress} activeOpacity={0.7}>
          <View
            style={tailwind`bg-[#f0f0f0] h-[40px] w-[40px] rounded-full flex items-center justify-center`}
          >
            <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
          </View>
        </TouchableOpacity>
      )}

      {showAuthButton && (
        <TouchableOpacity
          style={[
            tailwind`px-4 py-2 rounded-md`,
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
}
