import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { fontNames } from "#constants/fontNames.constants";

interface ArtworkStatusProps {
  readonly availability: boolean;
}

export default function ArtworkStatus({
  availability,
}: Readonly<ArtworkStatusProps>) {
  return (
    <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`text-gray-600 text-xs font-sans`}>Status:</Text>
        {availability ? (
          <View style={tw`bg-green-50 px-2 py-1 rounded-full`}>
            <Text style={tw`text-green-700 text-xs font-sans font-medium`}>
              Available
            </Text>
          </View>
        ) : (
          <View style={tw`bg-red-50 px-2 py-1 rounded-full`}>
            <Text style={tw`text-red-700 text-xs font-sans font-medium`}>
              Sold
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
