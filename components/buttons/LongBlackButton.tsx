import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
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
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  outline?: boolean;
  borderColor?: string;
  icon?: React.ReactNode;
};

export default function LongBlackButton({
  value,
  onClick,
  isDisabled = false,
  isLoading = false,
  style,
  textStyle,
  outline = false,
  borderColor = colors.primary_black,
  icon,
}: LongBlackButtonProps) {
  const animation = useRef(null);

  const isInactive = isDisabled || isLoading;

  let backgroundColor: string;
  if (isInactive) {
    backgroundColor = "#E0E0E0";
  } else if (outline) {
    backgroundColor = "transparent";
  } else {
    backgroundColor = colors.primary_black;
  }

  let textColor: string;
  if (isInactive) {
    textColor = "#A1A1A1";
  } else if (outline) {
    textColor = borderColor;
  } else {
    textColor = colors.white;
  }

  let outlineBorderColor: string;
  if (isInactive) {
    outlineBorderColor = "#A1A1A1";
  } else {
    outlineBorderColor = borderColor;
  }

  const defaultContainerStyle: ViewStyle = {
    height: 46,
    backgroundColor,
    ...(outline && {
      borderWidth: 1,
      borderColor: outlineBorderColor,
    }),
  };

  const defaultTextStyle: TextStyle = {
    color: textColor,
    fontSize: 16,
    fontWeight: "400",
  };

  const containerStyle = [
    tw`w-full flex items-center justify-center rounded-lg`,
    defaultContainerStyle,
    style,
  ];

  const mergedTextStyle = [defaultTextStyle, textStyle];

  if (isInactive) {
    return (
      <View style={containerStyle}>
        {isDisabled ? (
          <Text style={mergedTextStyle}>{value}</Text>
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
      <View style={tw`flex-row items-center justify-center gap-3`}>
        {icon && icon}
        <Text style={mergedTextStyle}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}
