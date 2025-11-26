import { StyleSheet, View } from "react-native";
import React from "react";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import { FlashList } from "@shopify/flash-list";

export default function ResultsListing({ data }: { data: any[] }) {
  const ArtworkItem = ({ item }: { item: ArtworkFlatlistItem }) => (
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
        galleryView
        availability={item.availability}
      />
    </View>
  );

  return (
    <View style={styles.artworksContainer}>
      <FlashList
        data={data}
        masonry
        onEndReachedThreshold={0.1}
        renderItem={({ item }: { item: ArtworkFlatlistItem }) => <ArtworkItem item={item} />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListFooterComponent={<View style={{ paddingTop: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "auto",
    gap: 15,
    marginTop: 10,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
