import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface ArtworkStatusBadgeProps {
  status: "Sold" | "Acquired" | string;
}

export default function ArtworkStatusBadge({
  status,
}: ArtworkStatusBadgeProps) {
  return (
    <View style={tw`self-start border border-slate-200 bg-slate-50 px-3 py-1`}>
      <Text
        style={tw`font-sans text-xs uppercase tracking-widest text-slate-500`}
      >
        {status}
      </Text>
    </View>
  );
}
