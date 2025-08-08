import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import tw from 'twrnc';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonLoaderContainer = ({ count = 5 }: { count?: number }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
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
    <Animated.View style={[tw`px-[20px] pt-[20px]`, { opacity: fadeAnim }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={tw`mb-[15px]`}>
          <View style={tw`bg-[#e5e7eb] rounded-[20px] h-[100px] overflow-hidden`}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  transform: [{ translateX }],
                },
              ]}
            />
            <View style={tw`absolute left-[20px] top-[20px]`}>
              <View style={tw`w-[180px] h-[14px] bg-[#d1d5db] rounded mb-[10px]`} />
              <View style={tw`w-[140px] h-[12px] bg-[#d1d5db] rounded mb-[6px]`} />
              <View style={tw`w-[100px] h-[10px] bg-[#d1d5db] rounded`} />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff50',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
});

export default SkeletonLoaderContainer;
