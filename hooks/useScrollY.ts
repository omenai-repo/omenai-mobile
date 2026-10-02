import { useRef } from "react";
import { Animated } from "react-native";

/**
 * Hook to create and manage scroll Y position for blur effects
 * @returns Animated.Value for scroll Y position and onScroll handler
 */
export function useScrollY() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }, // Supported since we moved opacity logic to interpolate
  );

  return { scrollY, onScroll };
}
