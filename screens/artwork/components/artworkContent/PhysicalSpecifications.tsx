import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface PhysicalSpecificationsProps {
  dimensions: {
    height?: string;
    width?: string;
    length?: string;
    weight?: string;
  };
}

const getDimensionWithUnit = (
  value: string | undefined,
  defaultUnit: string,
) => {
  if (!value || value === "0") return "";
  const hasUnit =
    value.includes("cm") ||
    value.includes("in") ||
    value.includes("kg") ||
    value.includes("lb");
  return hasUnit ? value : `${value}${defaultUnit}`;
};

export default function PhysicalSpecifications({
  dimensions,
}: Readonly<PhysicalSpecificationsProps>) {
  if (!dimensions) return null;

  const widthToDisplay =
    dimensions.width && dimensions.width !== "0"
      ? dimensions.width
      : dimensions.length;

  return (
    <View
      style={tw`bg-[#F9F9F9] px-3 py-4 mb-6 border-[0.5px] border-neutral-100`}
    >
      <Text style={tw`text-xs uppercase tracking-widest text-slate-400 mb-4`}>
        Physical Specifications
      </Text>
      <View style={tw`flex-row items-center gap-4 flex-wrap`}>
        {!!dimensions.height && dimensions.height !== "0" && (
          <View
            style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
          >
            <Text style={tw`text-sm text-slate-500 font-light`}>Height</Text>
            <Text style={tw`text-sm text-dark`}>
              {getDimensionWithUnit(dimensions.height, "cm")}
            </Text>
          </View>
        )}
        {!!widthToDisplay && widthToDisplay !== "0" && (
          <View
            style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
          >
            <Text style={tw`text-sm text-slate-500 font-light`}>Width</Text>
            <Text style={tw`text-sm text-dark`}>
              {getDimensionWithUnit(widthToDisplay, "cm")}
            </Text>
          </View>
        )}
        {!!dimensions.weight && dimensions.weight !== "0" && (
          <View
            style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
          >
            <Text style={tw`text-sm text-slate-500 font-light`}>Weight</Text>
            <Text style={tw`text-sm text-dark`}>
              {getDimensionWithUnit(dimensions.weight, "kg")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
