import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

export const ForfeitWarning = ({ targetPlan }: { targetPlan: string }) => (
  <View style={tw`mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3`}>
    <View style={tw`flex-row gap-2`}>
      <Text style={tw`text-amber-600`}>⚠️</Text>
      <Text
        style={tw`text-[11px] leading-relaxed font-medium text-amber-800 flex-1`}
      >
        <Text>Selecting this plan will </Text>
        <Text style={tw`font-bold`}>forfeit</Text>
        <Text> your one-time </Text>
        <Text style={tw`font-bold`}>2-month free trial</Text>
        <Text> on the monthly </Text>
        <Text style={tw`capitalize font-bold`}>{targetPlan}</Text>
        <Text> plan.</Text>
      </Text>
    </View>
  </View>
);
