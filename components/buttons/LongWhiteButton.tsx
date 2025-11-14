import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../../config/colors.config';
import tw from 'twrnc';

type LongWhiteButtonProps = {
  value: string;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  outline?: boolean;
  borderColor?: string;
};

export default function LongWhiteButton({ 
  value, 
  onClick,
  style,
  textStyle,
  outline = true,
  borderColor = colors.black,
}: LongWhiteButtonProps) {
  const defaultContainerStyle: ViewStyle = {
    height: 55,
    backgroundColor: outline ? 'transparent' : colors.white,
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
      <Text style={mergedTextStyle}>{value}</Text>
    </TouchableOpacity>
  );
}
