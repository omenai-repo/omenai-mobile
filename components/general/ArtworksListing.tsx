import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import EmptyArtworks from "./EmptyArtworks";
import Loader from "./Loader";
import { MasonryFlashList } from "@shopify/flash-list";
import { useAppStore } from "store/app/appStore";

export default function ArtworksListing({
  data,
  loadingMore,
  onEndReached,
}: {
  data: any[];
  loadingMore?: boolean;
  onEndReached?: () => void;
}) {
  const { userType } = useAppStore();
  if (data.length === 0)
    return <EmptyArtworks size={20} writeUp="No artworks to display" />;
  return (
    <View style={styles.artworksContainer}>
      <MasonryFlashList
        data={data}
        estimatedItemSize={400}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
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
              galleryView={userType !== "user" ? false : true}
            />
          </View>
        )}
        keyExtractor={(_, index) => JSON.stringify(index)}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListFooterComponent={() => {
          if (loadingMore) {
            return <Loader size={150} height={200} />;
          }
          return null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flex: 1,
    // marginHorizontal: 'auto',
    position: Platform.OS === "android" ? 'relative' :'static',
    left: Platform.OS === 'android' ? 15 : 0 
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  }
});
