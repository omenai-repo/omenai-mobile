import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef } from "react";
import { colors } from "#config/colors.config";
import LottieView from "lottie-react-native";
import tw from "twrnc";
import { animations } from "#constants/animations.constants";

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
  iconPosition?: "left" | "right";
  testID?: string;
};

export default function LongBlackButton({
  value,
  onClick,
  isDisabled = false,
  isLoading = false,
  style,
  textStyle,
  outline = false,
  borderColor = colors.black,
  icon,
  iconPosition = "left",
  testID,
}: LongBlackButtonProps) {
  const animation = useRef(null);

  const isInactive = isDisabled || isLoading;

  let backgroundColor: string;
  if (isInactive) {
    backgroundColor = colors.grey50;
  } else if (outline) {
    backgroundColor = "transparent";
  } else {
    backgroundColor = colors.black;
  }

  let textColor: string;
  if (isInactive) {
    textColor = colors.inputLabel;
  } else if (outline) {
    textColor = borderColor;
  } else {
    textColor = colors.white;
  }

  let outlineBorderColor: string;
  if (isInactive) {
    outlineBorderColor = colors.inputLabel;
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

  const containerStyle = [
    tw`w-full flex items-center justify-center rounded-sm`,
    defaultContainerStyle,
    style,
  ];

  const mergedTextStyle = [
    tw`uppercase text-center text-sm tracking-widest`,
    { color: textColor },
    textStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...containerStyle,
        pressed && tw`scale-99 opacity-90`,
      ]}
      onPress={onClick}
      disabled={isInactive}
      testID={testID}
    >
      <View style={tw`flex-row items-center justify-center w-full`}>
        {/* Invisible content to maintain button width */}
        <View
          style={[
            tw`flex-row items-center justify-center`,
            !!value && tw`gap-3`,
            { opacity: isLoading ? 0 : 1 },
          ]}
        >
          {iconPosition === "left" && icon}
          {!!value && <Text style={mergedTextStyle}>{value}</Text>}
          {iconPosition === "right" && icon}
        </View>

        {/* Overlay loader */}
        {isLoading && (
          <View style={tw`absolute inset-0 items-center justify-center`}>
            <LottieView
              autoPlay
              ref={animation}
              style={tw`w-[80px] h-[80px]`}
              source={animations.loader}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}
