import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export default function TrackingInitialState() {
  return (
    <View style={tw`py-16 items-center`}>
      <View
        style={tw`h-20 w-20 bg-[${colors.black}] rounded-full items-center justify-center mb-4`}
      >
        <Ionicons name="cube" size={40} color="#fff" />
      </View>
      <Text
        style={tw`text-[${colors.black}] text-lg font-sans-medium text-center`}
      >
        Track Your Artwork
      </Text>
      <Text
        style={tw`text-gray-500 text-base font-sans-regular tracking-wide text-center mt-2`}
      >
        Enter your tracking number above{"\n"}to view real-time shipment updates
      </Text>
    </View>
  );
}
