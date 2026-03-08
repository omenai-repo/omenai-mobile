import React from "react";
import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export type CardConfig = {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  amount: number | string;
  color: string;
  cardWidth: number;
};

const CardComp = ({ title, icon, amount, color, cardWidth }: CardConfig) => (
  <Animated.View
    style={[
      tw`rounded-md p-3`,
      {
        width: cardWidth,
        backgroundColor: colors.black,
        borderColor: "#ffffff10",
      },
    ]}
  >
    <View style={tw`flex-row justify-between items-center`}>
      <View style={tw`flex-1`}>
        <Text
          style={tw`text-xs uppercase font-sans-regular text-neutral-300 mb-[2px]`}
        >
          {title}
        </Text>
        <Text style={tw`text-lg text-white font-medium`}>
          {typeof amount === "number" ? amount.toLocaleString() : amount}
        </Text>
      </View>
      <View
        style={[
          tw`h-8 w-8 rounded-full justify-center items-center`,
          { backgroundColor: `${color}22` },
        ]}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
    </View>
  </Animated.View>
);

export default CardComp;
