import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface ArtworkStatusBadgeProps {
  status: string;
}

export default function ArtworkStatusBadge({
  status,
}: Readonly<ArtworkStatusBadgeProps>) {
  return (
    <View style={tw`self-start border border-neutral-300 px-2 py-1 rounded-sm`}>
      <Text
        style={tw`text-neutral-400 text-xs uppercase tracking-widest font-sans-medium`}
      >
        {status}
      </Text>
    </View>
  );
}
