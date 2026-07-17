import { View, Pressable, Text } from "react-native";
import React, { useEffect } from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type AuthTabsProps = {
  readonly tabs: string[];
  readonly stateIndex: number;
  readonly handleSelect: (e: number) => void;
};

type TabItemProps = {
  name: string;
  onClick: () => void;
  isSelected: boolean;
};

const TabItem = ({ name, onClick, isSelected }: TabItemProps) => {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [isSelected, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.96 + progress.value * 0.04 }],
  }));

  const textColor = isSelected ? colors.white : "#858585";

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          minWidth: 0,
          minHeight: 46,
        },
        animatedContainerStyle,
      ]}
    >
      <Pressable
        onPress={onClick}
        style={({ pressed }) => ({
          flex: 1,
          minWidth: 0,
          minHeight: 46,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected ? colors.black : "transparent",
          opacity: pressed ? 0.88 : 1,
        })}
      >
        <Text
          style={[
            tw`text-sm font-sans-regular text-center`,
            { color: textColor },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function AuthTabs({
  tabs,
  stateIndex,
  handleSelect,
}: AuthTabsProps) {
  return (
    <View
      style={tw`w-full flex-row gap-2.5 rounded-sm border border-[#E0E0E0] bg-[#FAFAFA] p-1`}
    >
      {tabs.map((label, idx) => (
        <TabItem
          name={label}
          key={`tab-${label}`}
          onClick={() => handleSelect(idx)}
          isSelected={stateIndex === idx}
        />
      ))}
    </View>
  );
}
