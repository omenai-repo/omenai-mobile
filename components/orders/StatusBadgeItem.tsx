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
  const iconsMap = {
    AntDesign,
    Feather,
    MaterialIcons,
    Ionicons,
  };
  const IconComponent = iconsMap[family];

  return (
    <View
      style={[
        tw`flex-row items-center px-2.5 py-1 rounded-sm`,
        bgStyle ? tw`${bgStyle}` : undefined,
        customBgColor ? { backgroundColor: customBgColor } : undefined,
      ]}
    >
      <IconComponent
        name={icon as any}
        size={14}
        color={iconColor}
        style={tw`mr-1`}
      />
      <Text
        style={[
          tw`text-sm font-medium`,
          textStyle ? tw`${textStyle}` : undefined,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};
