import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import { FlashList } from "@shopify/flash-list";
import EmptyArtworks from "./EmptyArtworks";
import Loader from "./Loader";
import { MasonryFlashList } from "@shopify/flash-list";

export default function ArtworksListing({
  data,
  loadingMore,
}: {
  data: any[];
  loadingMore?: boolean;
}) {
  if (data.length === 0)
    return <EmptyArtworks size={20} writeUp="No artworks to display" />;

  return (
    <View style={styles.artworksContainer}>
      <MasonryFlashList
        data={data}
        estimatedItemSize={200}
        renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
          <View style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
            <MiniArtworkCard
              title={item.title}
              url={item.url}
              artist={item.artist}
              showPrice={item.pricing.shouldShowPrice === "Yes"}
              price={item.pricing.usd_price}
              impressions={item.impressions}
              like_IDs={item.like_IDs}
              art_id={item.art_id}
            />
          </View>
        )}
        keyExtractor={(_, index) => JSON.stringify(index)}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
      {loadingMore && <Loader size={150} height={200} />}
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    marginTop: 30,
    zIndex: 5,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
