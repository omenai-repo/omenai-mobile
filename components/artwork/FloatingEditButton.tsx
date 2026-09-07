import React from "react";
import { Pressable, Text, StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
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
        tw`absolute bg-black/60 px-2.5 h-7 flex-row items-center gap-1.5 rounded-sm z-10`,
        style,
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <Feather name="edit-3" size={12} color="white" />
      <Text
        style={tw`text-white text-[10px] uppercase tracking-wider font-sans-medium`}
      >
        Edit
      </Text>
    </Pressable>
  );
}
