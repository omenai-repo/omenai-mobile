import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

export type AccountRowProps = {
  label: string;
  value?: string | null;
};

export const AccountRow = ({ label, value }: AccountRowProps) => (
  <View style={tw`flex-row items-center justify-between`}>
    <Text style={tw`text-[14px] text-[#1A1A1A]`}>{label}</Text>
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.85}
      style={tw`text-[14px] text-[#1A1A1A] font-bold text-right flex-1 ml-2`}
    >
      {value ?? "--"}
    </Text>
  </View>
);
