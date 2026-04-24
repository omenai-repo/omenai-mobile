import { colors } from "#config/colors.config";
import React from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

export type FollowComponentProps = {
  isFollowing: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export default function FollowComponent({ isFollowing, onPress, disabled }: FollowComponentProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        tw`px-4 py-2 rounded-full border`,
        isFollowing
          ? tw`bg-[${colors.black}] border-neutral-200`
          : tw`bg-white border-neutral-200`,
        disabled && tw`opacity-50`,
        pressed && !disabled && tw`opacity-90`,
      ]}
    >
      <Text
        style={[
          tw`text-xs font-semibold`,
          isFollowing ? tw`text-white` : tw`text-black`,
        ]}
      >
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </Pressable>
  );
}
