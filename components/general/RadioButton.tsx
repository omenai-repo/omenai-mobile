import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";

type RadioButtonProps = Readonly<{
  label: string;
  isSelected: boolean;
  onPress: () => void;
  size?: "default" | "small";
}>;

export default function RadioButton({
  label,
  isSelected,
  onPress,
  size = "default",
}: RadioButtonProps) {
  const isSmall = size === "small";
  const borderColor = isSelected ? colors.primary_black : colors.grey;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={tw`flex-row items-center ${isSmall ? "py-1.5" : "py-2"}`}
    >
      <View
        style={[
          tw`rounded-full border-2 items-center justify-center ${isSmall ? "w-4 h-4" : "w-5 h-5"}`,
          { borderColor },
        ]}
      >
        {isSelected && (
          <View
            style={tw`rounded-full bg-[${colors.primary_black}] ${isSmall ? "w-2.5 h-2.5" : "w-3 h-3"}`}
          />
        )}
      </View>
      <Text
        style={tw`ml-3 flex-1 ${isSmall ? "text-sm" : "text-base"} text-[${colors.primary_black}] font-${isSelected ? "600" : "400"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
