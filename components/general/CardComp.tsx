import React from "react";
import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "config/colors.config";

export type CardConfig = {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  amount: number;
  color: string;
  cardWidth: number;
};

const CardComp = ({ title, icon, amount, color, cardWidth }: CardConfig) => (
  <Animated.View
    style={[
      tw`rounded-[12px] px-[14px] py-[16px]`,
      {
        width: cardWidth,
        backgroundColor: colors.black,
        borderColor: "#ffffff10",
      },
    ]}
  >
    <View style={tw`flex-row justify-between items-center`}>
      <View style={tw`flex-1`}>
        <Text style={tw`text-[13px] text-[#FFFFFF99] mb-[2px]`}>{title}</Text>
        <Text style={tw`text-[18px] text-white font-bold`}>
          {amount.toLocaleString()}
        </Text>
      </View>
      <View
        style={[
          tw`h-[36px] w-[36px] rounded-full justify-center items-center`,
          { backgroundColor: `${color}22` },
        ]}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
    </View>
  </Animated.View>
);

export default CardComp;
