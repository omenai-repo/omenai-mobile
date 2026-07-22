import React from "react";
import { Animated, StyleSheet, Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BlurStatusBarProps = {
  readonly scrollY?: Animated.Value;
  readonly intensity?: number;
  readonly tint?: "light" | "dark" | "default";
  readonly threshold?: number;
};

export default function BlurStatusBar({
  scrollY,
  intensity = 80,
  tint = "light",
  threshold = 0,
}: Readonly<BlurStatusBarProps>) {
  const insets = useSafeAreaInsets();
  // We map the continuous scrollY value into an opacity between 0 and 1
  // using Animated.interpolate to keep all maths on the native thread.
  const opacity = scrollY
    ? scrollY.interpolate({
        inputRange: [threshold, threshold + 50],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : new Animated.Value(1);

  const shadowOpacity = scrollY
    ? opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.04],
        extrapolate: "clamp",
      })
    : 0.08;

  const elevation = scrollY
    ? opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 3],
        extrapolate: "clamp",
      })
    : 3;

  let backgroundColor: string;
  if (tint === "dark") {
    backgroundColor = "rgba(0, 0, 0, 0.7)";
  } else if (tint === "default") {
    backgroundColor = "rgba(255, 255, 255, 0.9)";
  } else {
    backgroundColor = "rgba(255, 255, 255, 0.85)";
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: insets.top,
          opacity: scrollY ? opacity : 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 4,
          elevation: elevation,
        },
      ]}
      pointerEvents="none"
    >
      <View style={{ overflow: "hidden", height: "100%" }}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={intensity}
            tint={tint}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor,
              },
            ]}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
