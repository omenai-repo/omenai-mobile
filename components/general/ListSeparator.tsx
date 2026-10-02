import React from "react";
import { View, ViewStyle } from "react-native";

type ListSeparatorProps = {
  readonly style?: ViewStyle;
  readonly width?: number;
  readonly height?: number;
};

export default function ListSeparator({ style, width = 20, height }: ListSeparatorProps) {
  return <View style={[{ width, height }, style]} />;
}
