import { Text, TextStyle, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { colors } from "../../config/colors.config";
import LottieView from "lottie-react-native";
import tw from "twrnc";
import loaderAnimation from "../../assets/other/loader-animation.json";

type LongBlackButtonProps = {
  value: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string | TextStyle["fontWeight"];
  disabledBgColor?: string;
  disabledTextColor?: string;
};

export default function LongBlackButton({
  value,
  onClick,
  isDisabled = false,
  isLoading = false,
  bgColor = colors.primary_black,
  textColor = colors.white,
  fontSize = 14,
  fontWeight = "400",
  disabledBgColor = "#E0E0E0",
  disabledTextColor = "#A1A1A1",
}: LongBlackButtonProps) {
  const animation = useRef(null);

  const backgroundColor = isDisabled || isLoading ? disabledBgColor : bgColor;

  const containerStyle = [
    tw`h-[55px] w-full flex items-center justify-center rounded-[95px]`,
    { backgroundColor },
  ];

  const textStyle = {
    color: isDisabled ? disabledTextColor : textColor,
    fontSize,
    fontWeight: fontWeight as TextStyle["fontWeight"],
  };

  if (isDisabled || isLoading) {
    return (
      <View style={containerStyle}>
        {isDisabled ? (
          <Text style={textStyle}>{value}</Text>
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
  }

  return (
    <TouchableOpacity activeOpacity={1} style={containerStyle} onPress={onClick}>
      <Text style={textStyle}>{value}</Text>
    </TouchableOpacity>
  );
}
