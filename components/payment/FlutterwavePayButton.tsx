import React from "react";
import { TouchableOpacity, Text } from "react-native";
import tw from "twrnc";

export type FlutterwavePayButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

const FlutterwavePayButton = ({
  onPress,
  disabled,
}: FlutterwavePayButtonProps) => (
  <TouchableOpacity
    style={tw`h-[55px] justify-center items-center bg-[#1a1a1a] rounded-[95px]`}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={tw`text-[#fff] font-medium`}>Pay with flutterwave</Text>
  </TouchableOpacity>
);

export default FlutterwavePayButton;
