import React from "react";
import { Animated, View } from "react-native";
import tw from "twrnc";

type StatusBarBackgroundProps = {
  insets: { top: number };
  opacity: Animated.AnimatedInterpolation<number>;
  shadowOpacity: Animated.AnimatedInterpolation<number>;
  elevation: Animated.AnimatedInterpolation<number>;
};

export default function StatusBarBackground({
  insets,
  opacity,
  shadowOpacity,
  elevation,
}: StatusBarBackgroundProps) {
  return (
    <Animated.View
      style={[
        tw`absolute top-0 left-0 right-0 bg-white z-10`,
        {
          height: insets.top,
          opacity,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity,
          shadowRadius: 4,
          elevation,
        },
      ]}
    />
  );
}

