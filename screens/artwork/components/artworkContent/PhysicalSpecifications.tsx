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

export default function PhysicalSpecifications({
  dimensions,
}: PhysicalSpecificationsProps) {
  if (!dimensions) return null;

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
              {dimensions.height}
              {dimensions.height.includes("cm") ||
              dimensions.height.includes("in")
                ? ""
                : "cm"}
            </Text>
          </View>
        )}
        {((!!dimensions.width && dimensions.width !== "0") ||
          (!!dimensions.length && dimensions.length !== "0")) && (
          <View
            style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
          >
            <Text style={tw`text-sm text-slate-500 font-light`}>Width</Text>
            <Text style={tw`text-sm text-dark`}>
              {dimensions.width && dimensions.width !== "0"
                ? dimensions.width
                : dimensions.length}
              {(dimensions.width && dimensions.width !== "0"
                ? dimensions.width
                : dimensions.length
              )?.includes("cm") ||
              (dimensions.width && dimensions.width !== "0"
                ? dimensions.width
                : dimensions.length
              )?.includes("in")
                ? ""
                : "cm"}
            </Text>
          </View>
        )}
        {!!dimensions.weight && dimensions.weight !== "0" && (
          <View
            style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
          >
            <Text style={tw`text-sm text-slate-500 font-light`}>Weight</Text>
            <Text style={tw`text-sm text-dark`}>
              {dimensions.weight}
              {dimensions.weight.includes("kg") ||
              dimensions.weight.includes("lb")
                ? ""
                : "kg"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
