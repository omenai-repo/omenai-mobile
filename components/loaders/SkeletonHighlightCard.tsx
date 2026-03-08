import React from "react";
import { View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type SkeletonCardProps = {
  cardWidth: number;
  style?: ViewStyle;
};

export const SkeletonHighlightCard = ({
  cardWidth,
  style,
}: SkeletonCardProps) => {
  return (
    <Animated.View
      style={[
        tw`rounded-md p-3 flex-row items-center justify-between`,
        {
          width: cardWidth,
          backgroundColor: colors.black,
        },
        style,
      ]}
    >
      <View style={tw`flex-1`}>
        <View style={tw`h-3 w-[70%] bg-neutral-800 rounded-sm mb-[6px]`} />
        <View style={tw`h-5 w-[50%] bg-neutral-800 rounded-sm`} />
      </View>
      <View
        style={tw`h-8 w-8 rounded-full bg-neutral-800 ml-[10px] items-center justify-center`}
      />
    </Animated.View>
  );
};
