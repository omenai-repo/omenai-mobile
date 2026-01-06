import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface ChartTooltipProps {
  value: number;
  label: string;
  index: number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  value,
  label,
  index,
}) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        marginLeft: index >= 6 ? -90 : -10,
        marginTop: 10,
        zIndex: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={tw`px-3 py-2 bg-black rounded-xl items-center shadow-sm elevation-5`}
      >
        <Text style={tw`text-white text-sm font-bold text-center`}>
          {`$${value.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
        </Text>
        <Text style={tw`text-gray-300 text-[10px] mt-0.5`}>{label}</Text>
      </View>
    </View>
  );
};
