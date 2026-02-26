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
    style={tw`bg-[${colors.white}] rounded-t-[20px] px-5 pb-10 pt-2.5 items-center w-full`}
  >
    {/* Handle Bar */}
    <View style={tw`w-full items-center mb-5`}>
      <View style={tw`w-10 h-1 bg-[${colors.grey50}] rounded-full`} />
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
    <Text style={tw`text-xl font-bold text-[${colors.primary_black}] mb-2.5`}>
      {title}
    </Text>

    {/* Message */}
    <Text
      style={tw`text-sm text-[${colors.black_light}] text-center mb-[30px] leading-5`}
    >
      {message}
    </Text>

    {/* Dismiss Button */}
    <LongBlackButton value={buttonText} onClick={onDismiss} />
  </View>
);
