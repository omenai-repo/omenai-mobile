import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface TrackingNoResultProps {
  error: string;
  handleSearchAgain: () => void;
}

export default function TrackingNoResult({
  error,
  handleSearchAgain,
}: Readonly<TrackingNoResultProps>) {
  return (
    <View style={tw`px-4 py-8 items-center`}>
      <View
        style={tw`h-16 w-16 bg-red-100 rounded-full items-center justify-center mb-4`}
      >
        <Ionicons name="alert-circle" size={32} color="#dc2626" />
      </View>
      <Text style={tw`text-black text-lg font-semibold text-center mb-2`}>
        Shipment Not Found
      </Text>
      <Text style={tw`text-gray-500 text-sm text-center mb-6`}>
        {error ||
          "We could not find tracking information for this number. Please check and try again."}
      </Text>
      <Pressable
        onPress={handleSearchAgain}
        style={tw`bg-slate-900 rounded-xl px-6 py-3`}
      >
        <Text style={tw`text-white font-semibold text-base`}>Try Again</Text>
      </Pressable>
    </View>
  );
}
