import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
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
};

export default function LongWhiteButton({
  value,
  onClick,
  style,
  textStyle,
  outline = true,
  borderColor = colors.black,
  icon,
}: LongWhiteButtonProps) {
  const defaultContainerStyle: ViewStyle = {
    height: 55,
    backgroundColor: outline ? "transparent" : colors.white,
    borderWidth: 1,
    borderColor: borderColor,
  };

  const defaultTextStyle: TextStyle = {
    color: colors.black,
    fontSize: 16,
  };

  const containerStyle = [
    tw`w-full flex items-center justify-center rounded-lg`,
    defaultContainerStyle,
    style,
  ];

  const mergedTextStyle = [defaultTextStyle, textStyle];

  return (
    <TouchableOpacity activeOpacity={1} style={containerStyle} onPress={onClick}>
      <View style={tw`flex-row items-center justify-center gap-3`}>
        {icon}
        <Text style={mergedTextStyle}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}
