import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import { FlashList } from "@shopify/flash-list";
import EmptyArtworks from "./EmptyArtworks";

export default function ArtworksListing({ data }: { data: any[] }) {

  if (data.length === 0)
    return (
      <EmptyArtworks
        size={20}
        writeUp="No artworks to display"
      />
    );

  return (
    <View style={styles.artworksContainer}>
      <FlashList
        data={data}
        renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
          <View style={{flex: 1, alignItems: 'center', paddingBottom: 20}}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
    zIndex: 5,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
