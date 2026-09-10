import React from "react";
import { Pressable, Text, StyleProp, ViewStyle } from "react-native";
import tw from "twrnc";

interface FloatingEditButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingEditButton({
  onPress,
  style,
}: Readonly<FloatingEditButtonProps>) {
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation?.();
        onPress();
      }}
      style={({ pressed }) => [
        tw`absolute bg-white/90 border border-neutral-200 px-2.5 py-1 flex-row items-center justify-center rounded-sm z-10`,
        style,
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <Text style={tw`text-black text-xs uppercase font-sans-medium`}>
        Edit
      </Text>
    </Pressable>
  );
}
