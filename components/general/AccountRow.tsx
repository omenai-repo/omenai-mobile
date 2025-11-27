import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

export type AccountRowProps = {
  label: string;
  value?: string | null;
};

export const AccountRow = ({ label, value }: AccountRowProps) => (
  <View style={tw`flex-row items-center`}>
    <Text style={tw`text-[14px] text-[#1A1A1A] flex-1`}>{label}</Text>
    <Text style={tw`text-[14px] text-[#1A1A1A] font-bold`}>
      {value ?? "--"}
    </Text>
  </View>
);
