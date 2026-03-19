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
  iconPosition?: "left" | "right";
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
  iconPosition = "right",
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

  return (
    <Pressable
      style={({ pressed }) => [
        containerStyle,
        pressed && !isLoading && !isDisabled ? { opacity: 0.9 } : null,
      ]}
      onPress={onClick}
      disabled={isDisabled || isLoading}
    >
      <View style={tw`flex-row items-center justify-center`}>
        {/* Invisible content to maintain button width */}
        <View
          style={[
            tw`flex-row items-center justify-center gap-[10px]`,
            { opacity: isLoading ? 0 : 1 },
          ]}
        >
          {iconPosition === "left" && children}
          <Text style={mergedTextStyle}>{value}</Text>
          {iconPosition === "right" && children}
        </View>

        {/* Absolutely positioned loader */}
        {isLoading && (
          <View style={tw`absolute inset-0 items-center justify-center`}>
            <LottieView
              autoPlay
              ref={animation}
              style={tw`w-[60px] h-[60px]`}
              source={loaderAnimation}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}
