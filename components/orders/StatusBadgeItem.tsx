import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import {
  Ionicons,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

interface StatusBadgeItemProps {
  icon: string;
  family?: "Ionicons" | "AntDesign" | "Feather" | "MaterialIcons";
  label: string;
  bgStyle?: string;
  textStyle?: string;
  iconColor?: string;
  customBgColor?: string;
}

export const StatusBadgeItem = ({
  icon,
  family = "Ionicons",
  label,
  bgStyle,
  textStyle,
  iconColor,
  customBgColor,
}: StatusBadgeItemProps) => {
  const IconComponent =
    family === "AntDesign"
      ? AntDesign
      : family === "Feather"
      ? Feather
      : family === "MaterialIcons"
      ? MaterialIcons
      : Ionicons;

  return (
    <View
      style={[
        tw`flex-row items-center px-2.5 py-1 rounded-md`,
        bgStyle ? tw`${bgStyle}` : {},
        customBgColor ? { backgroundColor: customBgColor } : {},
      ]}
    >
      <IconComponent
        name={icon as any}
        size={14}
        color={iconColor}
        style={tw`mr-1`}
      />
      <Text
        style={[tw`text-sm font-medium`, textStyle ? tw`${textStyle}` : {}]}
      >
        {label}
      </Text>
    </View>
  );
};
