import { StyleSheet, View } from "react-native";
import React from "react";
import ArtworkCard from "#components/artwork/ArtworkCard";

export default function RecentArtworkListing({
  data,
}: Readonly<{ data: any[] }>) {
  return (
    <View style={styles.artworksContainer}>
      <View style={styles.singleColumn}>
        {data[0]?.map((artwork: any, idx: any) => (
          <ArtworkCard
            key={idx}
            artwork={artwork}
            hideBackground
            useImageLoadAspectRatio
          />
        ))}
      </View>
      <View style={styles.singleColumn}>
        {data[1]?.map((artwork: any, idx: any) => (
          <ArtworkCard
            key={idx}
            artwork={artwork}
            hideBackground
            useImageLoadAspectRatio
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
