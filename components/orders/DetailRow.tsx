import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface DetailRowProps {
  label: string;
  children?: React.ReactNode;
  value?: string;
}

export const DetailRow = ({ label, value, children }: DetailRowProps) => {
  return (
    <View style={tw`flex-row items-center gap-[20px]`}>
      <Text style={tw`text-[14px] text-[#737373]`}>{label}</Text>
      {value ? (
        <Text style={tw`text-[14px] text-[#454545] font-semibold`}>
          {value}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
