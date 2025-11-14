import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BlurStatusBarProps = {
  scrollY?: Animated.Value;
  intensity?: number;
  tint?: "light" | "dark" | "default";
  threshold?: number;
};

export default function BlurStatusBar({
  scrollY,
  intensity = 80,
  tint = "light",
  threshold = 0,
}: BlurStatusBarProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scrollY) {
      const listener = scrollY.addListener(({ value }) => {
        const scrollAmount = Math.max(0, value - threshold);
        const mappedOpacity = Math.min(1, scrollAmount / 50);
        opacity.setValue(mappedOpacity);
      });

      return () => {
        scrollY.removeListener(listener);
      };
    } else {
      opacity.setValue(1);
    }
  }, [scrollY, threshold, opacity]);

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
                backgroundColor:
                  tint === "dark"
                    ? "rgba(0, 0, 0, 0.7)"
                    : tint === "default"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.85)",
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
