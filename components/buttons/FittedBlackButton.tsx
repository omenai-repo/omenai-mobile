import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import tw from "twrnc";
import loaderAnimation from "assets/other/loader-animation.json";

type FittedBlackButtonProps = {
  value: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function FittedBlackButton({
  value,
  isDisabled = false,
  onClick,
  isLoading = false,
  children,
  style,
  textStyle,
}: FittedBlackButtonProps) {
  const animation = useRef(null);

  const defaultContainerStyle: ViewStyle = {
    height: 44,
    backgroundColor: isDisabled || isLoading ? "#E0E0E0" : "#000000",
  };

  const defaultTextStyle: TextStyle = {
    color: isDisabled || isLoading ? "#A1A1A1" : "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
  };

  const containerStyle = [
    tw`flex flex-row items-center justify-center rounded-lg gap-[10px] px-5`,
    defaultContainerStyle,
    style,
  ];

  const mergedTextStyle = [defaultTextStyle, textStyle];

  if (isDisabled || isLoading) {
    return (
      <View style={containerStyle}>
        {isDisabled ? (
          <>
            <Text style={mergedTextStyle}>{value}</Text>
            {children}
          </>
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
    <TouchableOpacity activeOpacity={0.9} style={containerStyle} onPress={onClick}>
      <Text style={mergedTextStyle}>{value}</Text>
      {children}
    </TouchableOpacity>
  );
}
