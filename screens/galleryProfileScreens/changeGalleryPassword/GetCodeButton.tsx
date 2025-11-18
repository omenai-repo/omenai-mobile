import { Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { colors } from "config/colors.config";
import LottieView from "lottie-react-native";
import loaderAnimation from "assets/other/loader-animation.json";
import tw from "twrnc";

type FittedBlackButtonProps = {
  value: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
};

export default function GetCodeButton({
  value,
  isDisabled,
  onClick,
  isLoading,
}: FittedBlackButtonProps) {
  const animation = useRef(null);

  const defaultContainerStyle = {
    height: 44,
    backgroundColor:
      isDisabled || isLoading ? colors.grey50 : colors.primary_black,
  };
  const containerStyle = [
    tw`flex flex-row items-center justify-center rounded-lg gap-[10px] px-5`,
    defaultContainerStyle,
  ];
  const defaultTextStyle = {
    color: isDisabled || isLoading ? "#A1A1A1" : colors.white,
    fontSize: 16,
    fontWeight: "400" as const,
  };

  if (isDisabled || isLoading)
    return (
      <View style={containerStyle}>
        {isDisabled ? (
          <Text style={defaultTextStyle}>{value}</Text>
        ) : (
          <LottieView
            autoPlay
            ref={animation}
            style={tw`w-[100px] h-[100px]`}
            source={loaderAnimation}
          />
        )}
      </View>
    );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={containerStyle}
      onPress={onClick}
    >
      <Text style={defaultTextStyle}>{value}</Text>
    </TouchableOpacity>
  );
}
