import { Dimensions, View } from "react-native";
import React from "react";
import EmptyArtworks from "#components/general/EmptyArtworks";

const { height } = Dimensions.get("window");

export default function EmptyOrdersListing({ status }: { status: string }) {
  return (
    <View style={{ paddingTop: height / 5 }}>
      <EmptyArtworks icon="receipt-outline" />
    </View>
  );
}
