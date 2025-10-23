import { View } from "react-native";
import React from "react";
import { getNumberOfColumns } from "utils/utils_screen";
import { MasonryFlashList } from "@shopify/flash-list";
import MiniArtworkCard from "./MiniArtworkCard";
import tw from "twrnc";

const renderLoaderItem = () => (
  <View style={tw`flex-1 items-center pb-5`}>
    <MiniArtworkCard />
  </View>
);

export default function MiniArtworkCardLoader() {
  const dummyArr = new Array(20).fill("loader");

  return (
    <View style={tw`flex-1`}>
      <MasonryFlashList
        data={dummyArr}
        estimatedItemSize={20}
        onEndReachedThreshold={0.1}
        renderItem={renderLoaderItem}
        keyExtractor={(_, index) => JSON.stringify(index)}
        showsVerticalScrollIndicator={false}
        numColumns={getNumberOfColumns()}
      />
    </View>
  );
}
