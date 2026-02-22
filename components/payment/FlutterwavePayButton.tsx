import LongBlackButton from "#components/buttons/LongBlackButton";
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
  <LongBlackButton
    value="Pay with flutterwave"
    onClick={onPress}
    isDisabled={disabled}
  />
);

export default FlutterwavePayButton;
