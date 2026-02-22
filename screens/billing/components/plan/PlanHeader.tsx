import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface PlanHeaderProps {
  name: string;
}

export const PlanHeader = ({ name }: Readonly<PlanHeaderProps>) => {
  return (
    <View style={tw`flex-row items-start justify-between`}>
      <View>
        <Text style={tw`text-slate-900 text-lg font-bold`}>{name}</Text>
        <Text style={tw`mt-1 text-slate-600 text-xs`}>
          {name === "Basic" ? "Essential features to get started" : null}
          {name === "Pro" ? "Perfect for growing businesses" : null}
          {name === "Premium" ? "Advanced features for scale" : null}
        </Text>
      </View>

      {name === "Premium" && (
        <View style={tw`p-2 rounded-sm bg-purple-100`}>
          <Ionicons name="sparkles-sharp" size={16} color="#7c3aed" />
        </View>
      )}
    </View>
  );
};
