import React from "react";
import { View, Text, ViewStyle, StyleProp } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import LongBlackButton from "#components/buttons/LongBlackButton";
import * as Notifications from "expo-notifications";

type Props = {
  permissionStatus: Notifications.PermissionStatus | null;
  requestPermission: () => Promise<Notifications.PermissionStatus>;
  openSettings: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function NotificationPermissionPrompt({
  permissionStatus,
  requestPermission,
  openSettings,
  style,
}: Readonly<Props>) {
  if (permissionStatus === null || permissionStatus === "granted") return null;

  return (
    <View
      style={[
        tw`mt-6 mb-2 bg-gray-50 p-4 rounded-xl border border-gray-200`,
        style,
      ]}
    >
      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <MaterialIcons
          name="notifications-off"
          size={20}
          color={colors.primary_black}
        />
        <Text style={tw`text-base font-bold text-[${colors.primary_black}]`}>
          Notifications are disabled
        </Text>
      </View>
      <Text style={tw`text-sm text-[${colors.black_light}] mb-4 leading-5`}>
        Enable notifications to stay updated on critical alerts and order
        updates.
      </Text>
      <LongBlackButton
        value="Enable Notifications"
        onClick={() => {
          if (permissionStatus === "undetermined") {
            requestPermission();
          } else {
            openSettings();
          }
        }}
      />
    </View>
  );
}
