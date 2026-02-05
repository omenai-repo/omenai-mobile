import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

export default function TrackingInitialState() {
  return (
    <View style={tw`px-4 py-12 items-center`}>
      <View
        style={tw`h-20 w-20 bg-slate-900 rounded-full items-center justify-center mb-4`}
      >
        <Ionicons name="cube" size={40} color="#fff" />
      </View>
      <Text style={tw`text-black text-lg font-semibold text-center`}>
        Track Your Artwork
      </Text>
      <Text style={tw`text-gray-500 text-sm text-center mt-2`}>
        Enter your tracking number above to view real-time shipment updates
      </Text>
    </View>
  );
}
