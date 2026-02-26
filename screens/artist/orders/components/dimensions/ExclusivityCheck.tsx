import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type ExclusivityCheckProps = {
  userType: string;
  exclusivityType?: string;
};

export default function ExclusivityCheck({
  userType,
  exclusivityType,
}: Readonly<ExclusivityCheckProps>) {
  if (userType !== "artist") return null;
  if (exclusivityType !== "non-exclusive" && exclusivityType) return null;

  return (
    <View
      style={tw`mb-5 flex-row bg-amber-50 border border-amber-100 rounded-md p-3`}
    >
      <Ionicons
        name="warning"
        size={16}
        color="#D97706"
        style={tw`mt-0.5 mr-2`}
      />
      <View style={tw`flex-1`}>
        <Text style={tw`text-sm font-semibold text-gray-900`}>
          Exclusivity Check
        </Text>
        <Text style={tw`text-xs text-gray-600 mt-1 leading-5`}>
          Note: This artwork is non-exclusive. Please ensure it has not been
          sold elsewhere before proceeding.
        </Text>
      </View>
    </View>
  );
}
