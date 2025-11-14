import { Text, View, Pressable } from "react-native";
import React from "react";
import { colors } from "../../config/colors.config";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";

type NextButtonProps = {
  isDisabled: boolean;
  handleButtonClick: () => void;
};

export default function NextButton({ isDisabled, handleButtonClick }: NextButtonProps) {
  if (isDisabled)
    return (
      <View
        style={[
          tw`h-[46px] flex-row items-center gap-2.5 px-7 rounded-lg`,
          { backgroundColor: colors.inputBorder },
        ]}
      >
        <Text style={[tw`text-base`, { color: "#A1A1A1" }]}>Next</Text>
        <AntDesign name="arrowright" color="#A1A1A1" size={20} />
      </View>
    );

  return (
    <Pressable
      onPress={handleButtonClick}
      style={({ pressed }) => [
        tw`h-[46px] flex-row items-center gap-2.5 px-7 rounded-lg`,
        { backgroundColor: colors.black },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[tw`text-base`, { color: colors.white }]}>Next</Text>
      <AntDesign name="arrowright" color={colors.white} size={20} />
    </Pressable>
  );
}
