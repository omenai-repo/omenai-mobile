import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { colors } from "../../config/colors.config";
import tw from "twrnc";

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
  const defaultContainerStyle: ViewStyle = {
    height: 55,
    backgroundColor: outline ? "transparent" : colors.white,
    borderWidth: 1,
    borderColor: borderColor,
    opacity: isLoading ? 0.7 : 1,
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
    <TouchableOpacity
      activeOpacity={1}
      style={containerStyle}
      onPress={isLoading ? undefined : onClick}
    >
      <View style={tw`flex-row items-center justify-center gap-3`}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={
              textStyle && (textStyle as any).color
                ? (textStyle as any).color
                : colors.black
            }
          />
        ) : (
          <>
            {icon}
            <Text style={mergedTextStyle}>{value}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
