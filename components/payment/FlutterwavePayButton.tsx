import LongBlackButton from "#components/buttons/LongBlackButton";
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import tw from "twrnc";

export type FlutterwavePayButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const FlutterwavePayButton = ({
  onPress,
  disabled,
  isLoading,
}: FlutterwavePayButtonProps) => (
  <LongBlackButton
    value="Pay with flutterwave"
    onClick={onPress}
    isDisabled={disabled}
    isLoading={isLoading}
  />
);

export default FlutterwavePayButton;
