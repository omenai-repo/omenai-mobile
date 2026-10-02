import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

interface ArtworkStatusProps {
  readonly availability: boolean;
}

export default function ArtworkStatus({
  availability,
}: Readonly<ArtworkStatusProps>) {
  return (
    <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text
          style={tw`text-[#A3A3A3] text-xs uppercase tracking-widest font-sans-medium`}
        >
          Status
        </Text>
        {availability ? (
          <View style={tw`border border-black px-2 py-1 rounded-sm`}>
            <Text
              style={tw`text-black text-xs uppercase tracking-widest font-sans-medium`}
            >
              Available
            </Text>
          </View>
        ) : (
          <View style={tw`border border-neutral-300 px-2 py-1 rounded-sm`}>
            <Text
              style={tw`text-neutral-400 text-xs uppercase tracking-widest font-sans-medium`}
            >
              Sold
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
