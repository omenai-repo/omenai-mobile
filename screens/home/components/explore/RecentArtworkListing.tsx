import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ArtworkCard from "#components/artwork/ArtworkCard";

export default function RecentArtworkListing({ data }: { data: any[] }) {
  return (
    <View style={styles.artworksContainer}>
      <View style={styles.singleColumn}>
        {data[0]?.map((artwork: any, idx: any) => (
          <ArtworkCard
            key={idx}
            art_id={artwork.art_id}
            title={artwork.title}
            artist={artwork.artist}
            url={artwork.url}
            price={artwork.pricing.usd_price || 0}
            showPrice={artwork.pricing.shouldShowPrice === "Yes"}
            availiablity={artwork.availability}
          />
        ))}
      </View>
      <View style={styles.singleColumn}>
        {data[1]?.map((artwork: any, idx: any) => (
          <ArtworkCard
            key={idx}
            art_id={artwork.art_id}
            title={artwork.title}
            artist={artwork.artist}
            url={artwork.url}
            price={artwork.pricing.usd_price || 0}
            showPrice={artwork.pricing.shouldShowPrice === "Yes"}
            availiablity={artwork.availability}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
});
