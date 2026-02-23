import { colors } from "#config/colors.config";
import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface ChartTooltipProps {
  value: number;
  label: string;
  index: number;
  maxValue: number;
  totalBars: number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  value,
  label,
  index,
  maxValue,
  totalBars,
}) => {
  const tooltipWidth = 140;
  const barWidth = 22;
  // Shift relative margin based on position (0 to 1) to keep tooltip on screen
  const maxShift = tooltipWidth - barWidth; // ~118

  // Calculate relative position (0 to 1)
  const relativePos = totalBars > 1 ? index / (totalBars - 1) : 0;

  // Interpolate marginLeft: from 0 (start) to -maxShift (end)
  const marginLeft = -1 * relativePos * maxShift;

  const marginTop = 0;

  return (
    <View
      style={{
        marginLeft,
        marginTop,
        zIndex: 100,
        marginBottom: 0,
      }}
    >
      <View
        style={[
          tw`rounded-md p-2.5 w-[140px] shadow-lg`,
          { backgroundColor: colors.black },
        ]}
      >
        <Text style={tw`text-gray-400 text-[8px] uppercase mb-0.5`}>
          {label}
        </Text>
        <Text style={tw`text-white text-base font-bold mb-0.5`}>
          {`$${value.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
        </Text>
        <Text style={tw`text-gray-400 text-[8px] mb-1.5 leading-tight`}>
          Revenue generated this period
        </Text>

        <View style={tw`h-[1px] bg-gray-700 w-full my-1.5`} />

        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-gray-400 text-[8px]`}>Series</Text>
          <Text style={tw`text-gray-200 text-[8px]`}>Sales Revenue ($)</Text>
        </View>
      </View>
    </View>
  );
};
