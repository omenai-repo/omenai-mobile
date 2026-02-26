import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

type SelectedDimensionsSummaryProps = {
  usePreset: boolean;
  dimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
};

export default function SelectedDimensionsSummary({
  usePreset,
  dimensions,
}: SelectedDimensionsSummaryProps) {
  if (!usePreset || !dimensions.length) return null;

  return (
    <View style={tw`bg-white border border-gray-200 rounded-md p-4 mt-2`}>
      <Text
        style={tw`text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4`}
      >
        Selected Package Details
      </Text>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mr-4`}>
          <Text style={tw`text-[10px] text-gray-400 mb-1`}>DIMENSIONS</Text>
          <Text style={tw`text-sm font-medium text-gray-900`}>
            {dimensions.length} × {dimensions.width} × {dimensions.height} cm
          </Text>
          <Text style={tw`text-xs text-gray-500 mt-0.5`}>
            {(Number(dimensions.length) / 2.54).toFixed(1)} ×{" "}
            {(Number(dimensions.width) / 2.54).toFixed(1)} ×{" "}
            {(Number(dimensions.height) / 2.54).toFixed(1)} in
          </Text>
        </View>
        <View style={tw`items-end`}>
          <Text style={tw`text-[10px] text-gray-400 mb-1`}>WEIGHT</Text>
          <Text style={tw`text-sm font-medium text-gray-900`}>
            {dimensions.weight} kg
          </Text>
          <Text style={tw`text-xs text-gray-500 mt-0.5`}>
            {(Number(dimensions.weight) * 2.20462).toFixed(1)} lbs
          </Text>
        </View>
      </View>
    </View>
  );
}
