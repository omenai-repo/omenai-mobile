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
}: LongBlackButtonProps) {
  const animation = useRef(null);

  const defaultContainerStyle: ViewStyle = {
    height: 46,
    backgroundColor: isDisabled || isLoading 
      ? '#E0E0E0' 
      : outline 
        ? 'transparent' 
        : colors.primary_black,
    ...(outline && { 
      borderWidth: 1, 
      borderColor: isDisabled || isLoading ? '#A1A1A1' : borderColor 
    }),
  };

  const defaultTextStyle: TextStyle = {
    color: isDisabled || isLoading 
      ? '#A1A1A1' 
      : outline 
        ? borderColor 
        : colors.white,
    fontSize: 16,
    fontWeight: '400',
  };

  const containerStyle = [
    tw`w-full flex items-center justify-center rounded-lg`,
    defaultContainerStyle,
    style,
  ];

  const mergedTextStyle = [defaultTextStyle, textStyle];

  if (isDisabled || isLoading) {
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
      <Text style={mergedTextStyle}>{value}</Text>
    </TouchableOpacity>
  );
}
