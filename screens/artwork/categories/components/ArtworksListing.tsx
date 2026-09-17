import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MiniArtworkCard from "#components/artwork/MiniArtworkCard";
import { FlashList } from "@shopify/flash-list";
import { useAppStore } from "#store/app/appStore";

export default function ArtworksListing({ data }: { data: any[] }) {
  const userSession = useAppStore((s) => s.userSession);
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
        extraData={userSession?.id}
        renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
          <View style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
            <MiniArtworkCard
              availability={item.availability}
              title={item.title}
              url={item.url}
              artist={item.artist}
              showPrice={
                !!userSession?.id && item.pricing.shouldShowPrice === "Yes"
              }
              price={item.pricing.usd_price}
              impressions={item.impressions}
              like_IDs={item.like_IDs}
              art_id={item.art_id}
            />
          </View>
        )}
        keyExtractor={(item, index) => item?.art_id ?? `art-${index}`}
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
    marginTop: 20,
    zIndex: 5,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
