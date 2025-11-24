import React from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={tw.style(
      "px-4 py-2 h-[40px] justify-center items-center rounded-lg border-2",
      isSelected ? "bg-black border-black" : "bg-white border-gray-300"
    )}
  >
    <Text style={tw.style("font-bold text-[14px]", isSelected ? "text-white" : "text-[#1A1A1A]")}>
      {label}
    </Text>
  </Pressable>
);

export default ToggleButton;
