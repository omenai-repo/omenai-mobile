import { View } from "react-native";
import React from "react";
import EmptyArtworks from "#components/general/EmptyArtworks";
import tw from "twrnc";

export default function EmptyOrdersListing({ status }: { status: string }) {
  return (
    <View style={tw`flex-1`}>
      <EmptyArtworks icon="receipt-outline" />
    </View>
  );
}
