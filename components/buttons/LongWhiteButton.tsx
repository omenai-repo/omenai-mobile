import {
  StyleProp,
  Text,
  TextStyle,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef } from "react";
import { colors } from "#config/colors.config";
import LottieView from "lottie-react-native";
import tw from "twrnc";
import { animations } from "#constants/animations.constants";

type LongWhiteButtonProps = {
  value: string;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  outline?: boolean;
  borderColor?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

export default function LongWhiteButton({
  value,
  onClick,
  style,
  textStyle,
  outline = true,
  borderColor = colors.black,
  icon,
  isLoading,
}: LongWhiteButtonProps) {
  const animation = useRef(null);

  const defaultContainerStyle: ViewStyle = {
    height: 46,
    backgroundColor: outline ? "transparent" : colors.white,
    borderWidth: 1,
    borderColor: borderColor,
  };

  const containerStyle = [
    tw`w-full flex items-center justify-center rounded-sm`,
    defaultContainerStyle,
    style,
  ];

  const mergedTextStyle = [
    tw`text-center text-sm tracking-widest`,
    { color: colors.black },
    textStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...containerStyle,
        pressed && !isLoading && tw`scale-99 opacity-90`,
      ]}
      onPress={onClick}
      disabled={isLoading}
    >
      <View style={tw`flex-row items-center justify-center w-full`}>
        {/* Content — hidden while loading to preserve button width */}
        <View
          style={[
            tw`flex-row items-center justify-center gap-3`,
            { opacity: isLoading ? 0 : 1 },
          ]}
        >
          {icon}
          <Text style={mergedTextStyle}>{value}</Text>
        </View>

        {/* Overlay Lottie loader */}
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
