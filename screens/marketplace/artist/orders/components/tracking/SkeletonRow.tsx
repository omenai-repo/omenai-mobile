import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface SkeletonRowProps {
  widthPct?: string | number;
  height?: number;
  borderRadius?: number;
}

export function SkeletonRow({
  widthPct = "100%",
  height = 14,
  borderRadius = 8,
}: Readonly<SkeletonRowProps>) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          opacity: anim,
          backgroundColor: "#E6E7E8",
          width: widthPct as any,
          height,
          borderRadius,
        },
      ]}
    />
  );
}
