import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import { FlashList } from "@shopify/flash-list";

export default function ArtworksListing({ data }: { data: any[] }) {
  if (data.length === 0)
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          No artworks to display
        </Text>
      </View>
    );

  return (
    <View style={styles.artworksContainer}>
      <FlashList
        data={data}
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
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        numColumns={2}
        estimatedItemSize={278}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
    zIndex: 5,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
