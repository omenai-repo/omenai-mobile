import { useRef } from 'react';
import { Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

/**
 * Hook to create and manage scroll Y position for blur effects
 * @returns Animated.Value for scroll Y position and onScroll handler
 */
export function useScrollY() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // Blur animations don't support native driver
  );

  return { scrollY, onScroll };
}

