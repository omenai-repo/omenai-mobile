import { Text, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";

type NotificationProps = {
  title: string;
  message: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  onDismiss: () => void;
  buttonText?: string;
};

export const BottomSheetView = ({
  title,
  message,
  iconName,
  iconColor,
  iconBg,
  onDismiss,
  buttonText = "Dismiss",
}: NotificationProps) => (
  <View
    style={[
      tw`rounded-t-[20px] px-5 pb-10 pt-2.5 items-center w-full`,
      { backgroundColor: colors.white },
    ]}
  >
    {/* Handle Bar */}
    <View style={tw`w-full items-center mb-5`}>
      <View
        style={[tw`w-10 h-1 rounded-full`, { backgroundColor: colors.grey50 }]}
      />
    </View>

    {/* Icon */}
    <View
      style={[
        tw`w-[60px] h-[60px] rounded-full items-center justify-center mb-[15px]`,
        { backgroundColor: iconBg },
      ]}
    >
      <MaterialIcons name={iconName} color={iconColor} size={32} />
    </View>

    {/* Title */}
    <Text
      style={[tw`text-xl font-bold mb-2.5`, { color: colors.primary_black }]}
    >
      {title}
    </Text>

    {/* Message */}
    <Text
      style={[
        tw`text-sm text-center mb-[30px] leading-5`,
        { color: colors.black_light },
      ]}
    >
      {message}
    </Text>

    {/* Dismiss Button */}
    <LongBlackButton value={buttonText} onClick={onDismiss} />
  </View>
);
