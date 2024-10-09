import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import EmptyArtworks from "components/general/EmptyArtworks";

export default function ArtworksMediumListing({ data }: { data: any[] }) {
  const [listing, setListing] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 1) {
      var indexToSplit = data.length / 2;
      var first = data.slice(0, indexToSplit);
      var second = data.slice(indexToSplit);

      setListing([first, second]);
    } else if (data.length > 0) {
      setListing([data, []]);
    }
  }, []);

  if (data.length === 0)
    return (
      <View style={{ marginTop: 30 }}>
        <EmptyArtworks writeUp="No artworks to display" size={120} />
      </View>
    );

  return (
    <View style={styles.artworksContainer}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={listing[0]}
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
          // style={{gap: 200}}
          contentContainerStyle={{ gap: 30 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={listing[1]}
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
          // style={{gap: 200}}
          contentContainerStyle={{ gap: 30 }}
        />
      </View>
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
