import { StyleSheet, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function ResultsListing({ data }: { data: any[] }) {
  return (
    <ScrollWrapper
      style={{ marginTop: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.artworksContainer}>
        <FlatList
          data={data[0]}
          renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
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
          )}
          keyExtractor={(_, index) => JSON.stringify(index)}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          style={{ gap: 200 }}
          contentContainerStyle={{ gap: 30 }}
        />
        <FlatList
          data={data[1]}
          renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
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
          )}
          keyExtractor={(_, index) => JSON.stringify(index)}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          style={{ gap: 200 }}
          contentContainerStyle={{ gap: 30 }}
        />
      </View>
    </ScrollWrapper>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
