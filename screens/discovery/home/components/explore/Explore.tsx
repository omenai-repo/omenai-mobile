import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TrendingArtworksListing from "./TrendingArtworksListing";
import RecentArtworkListing from "./RecentArtworkListing";
import { useExploreArtworks } from "#hooks/discovery/useExploreArtworks";

export default function Explore() {
  const { data, isLoading, listingType } = useExploreArtworks();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ textAlign: "center" }}>
          No artworks match your profile, try updating your preferences
        </Text>
      </View>
    );
  }

  return (
    <View>
      {listingType === "trending" && <TrendingArtworksListing data={data} />}
      {(listingType === "recent" || listingType === "curated") && (
        <RecentArtworkListing data={data} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
