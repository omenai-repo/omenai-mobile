import { Pressable } from "react-native";
import React from "react";
import { colors } from "../../config/colors.config";
import AntDesign from "@expo/vector-icons/AntDesign";
import tw from "twrnc";

type handleBackCLickProp = {
  handleBackClick: () => void;
  disabled?: boolean;
};

export default function BackFormButton({ handleBackClick, disabled }: handleBackCLickProp) {
  return (
    <Pressable
      onPress={handleBackClick}
      disabled={disabled}
      style={({ pressed }) => [
        tw`h-11 w-[70px] rounded-lg border flex-row items-center justify-center`,
        { borderColor: colors.primary_black },
        pressed && !disabled ? { opacity: 0.8 } : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <AntDesign name="arrowleft" color={colors.primary_black} size={24} />
    </Pressable>
  );
}
