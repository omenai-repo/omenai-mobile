import { View, Pressable } from "react-native";
import React, { useEffect } from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

type AuthTabsProps = {
  tabs: string[];
  stateIndex: number;
  handleSelect: (e: number) => void;
};

type TabItemProps = {
  name: string;
  onClick: () => void;
  isSelected: boolean;
};

const TabItem = ({ name, onClick, isSelected }: TabItemProps) => {
  // Only animate scale to keep behavior stable across platforms.
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [isSelected, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = 0.96 + progress.value * 0.04; // Interpolate from 0.96 to 1.0
    return {
      transform: [{ scale }],
    };
  });

  // Use theme colors (avoid platform-specific interpolation issues)
  const backgroundColor = isSelected ? colors.black : "transparent";
  const textColor = isSelected ? colors.white : "#858585";

  return (
    <Animated.View style={[tw`flex-1`, animatedContainerStyle]}>
      <Pressable
        onPress={onClick}
        style={({ pressed }) => [
          tw`h-[46px] flex-1 rounded-lg items-center justify-center overflow-hidden`,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Animated.View style={[tw`absolute inset-0 rounded-lg`, { backgroundColor }]} />
        <Animated.Text style={[tw`text-sm`, { zIndex: 10, color: textColor }]}>
          {name}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
};

export default function AuthTabs({ tabs, stateIndex, handleSelect }: AuthTabsProps) {
  return (
    <View
      style={tw`w-full bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg p-1 flex-row gap-[15px]`}
    >
      {tabs.map((i, idx) => (
        <TabItem
          name={i}
          key={`tab-${idx}`}
          onClick={() => handleSelect(idx)}
          isSelected={stateIndex === idx}
        />
      ))}
    </View>
  );
}
