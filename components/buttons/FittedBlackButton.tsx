import {
  StyleProp,
  Text,
  TextStyle,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { colors } from "#config/colors.config";
import tw from "twrnc";
import loaderAnimation from "#assets/other/loader-animation.json";
import { useDevice } from "#hooks/useDevice";

type FittedBlackButtonProps = {
  value: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  responsive?: boolean;
};

export default function FittedBlackButton({
  value,
  isDisabled = false,
  onClick,
  isLoading = false,
  children,
  style,
  textStyle,
  responsive = false,
}: FittedBlackButtonProps) {
  const animation = useRef(null);
  const { isTablet } = useDevice();

  const defaultContainerStyle: ViewStyle = {
    height: 44,
    backgroundColor:
      isDisabled || isLoading ? colors.grey50 : colors.primary_black,
  };

  const defaultTextStyle: TextStyle = {
    color: isDisabled || isLoading ? colors.inputLabel : colors.white,
    fontSize: 14,
    fontWeight: "300",
  };

  const containerStyle = [
    tw`flex flex-row items-center justify-center rounded-md gap-[10px] px-5`,
    defaultContainerStyle,
    responsive &&
      ({
        alignSelf: isTablet ? "flex-start" : "auto",
        width: isTablet ? undefined : "100%",
      } as ViewStyle),
    style,
  ];

  const mergedTextStyle = [defaultTextStyle, textStyle];

  if (isDisabled || isLoading) {
    return (
      <View style={containerStyle}>
        {isLoading ? (
          <LottieView
            autoPlay
            ref={animation}
            style={tw`w-[100px] h-[100px]`}
            source={loaderAnimation}
          />
        ) : (
          <>
            <Text style={mergedTextStyle}>{value}</Text>
            {children}
          </>
        )}
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        containerStyle,
        pressed ? { opacity: 0.9 } : null,
      ]}
      onPress={onClick}
    >
      <Text style={mergedTextStyle}>{value}</Text>
      {children}
    </Pressable>
  );
}
