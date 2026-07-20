import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import tw from "twrnc";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SkeletonLoaderContainer = ({ count = 5 }: { count?: number }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Loop shimmer
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <Animated.View style={[tw`flex-1 bg-white px-5`, { opacity: fadeAnim }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`skeleton-item-${index}`}
          style={tw`flex-row items-start py-4 border-b border-[#F2F2F7] overflow-hidden`}
        >
          {/* Shimmer Overlay across the row */}
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [{ translateX }],
              },
            ]}
          />

          {/* Left Circle Icon Placeholder */}
          <View style={tw`w-11 h-11 rounded-full bg-[#E5E7EB] mr-3.5`} />

          {/* Right Text Fields */}
          <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              {/* Title Block */}
              <View style={tw`w-36 h-3.5 bg-[#E5E7EB] rounded-sm`} />
              {/* Time Block */}
              <View style={tw`w-12 h-3 bg-[#E5E7EB] rounded-sm`} />
            </View>

            {/* Body Text Blocks */}
            <View style={tw`w-[85%] h-3 bg-[#E5E7EB] rounded-sm mb-1.5`} />
            <View style={tw`w-[55%] h-3 bg-[#E5E7EB] rounded-sm`} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shimmerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#ffffff50",
    width: "100%",
    height: "100%",
    opacity: 0.4,
    zIndex: 1,
  },
});

export default SkeletonLoaderContainer;
