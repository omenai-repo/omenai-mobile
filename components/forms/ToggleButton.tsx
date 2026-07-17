import React from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";

interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[
      tw`px-4 py-2 h-[40px] justify-center items-center rounded-lg border-2`,
      isSelected
        ? { backgroundColor: colors.black, borderColor: colors.black }
        : { backgroundColor: colors.white, borderColor: colors.grey50 },
    ]}
  >
    <Text
      style={[
        tw`font-bold text-[14px]`,
        isSelected ? { color: colors.white } : { color: colors.primary_black },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

export default ToggleButton;
