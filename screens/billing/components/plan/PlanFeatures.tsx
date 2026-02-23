import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface PlanFeaturesProps {
  featureList: string[];
}

export const PlanFeatures = ({ featureList }: Readonly<PlanFeaturesProps>) => {
  return (
    <View style={tw`rounded-md bg-slate-50 p-3`}>
      {featureList.map((benefit, i) => (
        <View key={`${benefit}-${i}`} style={tw`flex-row items-start mb-2`}>
          <Ionicons
            name="checkmark"
            size={14}
            color="#0f172a"
            style={tw`mt-0.5`}
          />
          <Text style={tw`ml-2 text-[12px] leading-5 text-slate-600 flex-1`}>
            {benefit}
          </Text>
        </View>
      ))}
    </View>
  );
};
