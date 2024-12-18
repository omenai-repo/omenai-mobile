import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useCallback } from "react";
import MiniArtworkCard from "components/artwork/MiniArtworkCard";
import EmptyArtworks from "./EmptyArtworks";
import Loader from "./Loader";
import { MasonryFlashList } from "@shopify/flash-list";
import { useAppStore } from "store/app/appStore";
import { getNumberOfColumns } from "utils/utils_screen";
import { debounce } from "lodash";

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

  const isGalleryView = userType === "user";

  const renderItem = useCallback(
    ({ item }: { item: ArtworkFlatlistItem }) => (
      <MiniArtworkCard
        title={item.title}
        url={item.url}
        artist={item.artist}
        showPrice={item.pricing.shouldShowPrice === "Yes"}
        price={item.pricing.usd_price}
        impressions={item.impressions}
        like_IDs={item.like_IDs}
        art_id={item.art_id}
        galleryView={isGalleryView}
      />
    ),
    [isGalleryView]
  );

  const ListFooterComponent = useMemo(
    () => (loadingMore ? <Loader size={150} height={400} /> : null),
    [loadingMore]
  );

  const debouncedOnEndReached = useMemo(
    () => (onEndReached ? debounce(onEndReached, 300) : undefined),
    [onEndReached]
  );

  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyArtworks size={20} writeUp="No artworks to display" />;
  }

  return (
    <View style={styles.artworksContainer}>
      <MasonryFlashList
        data={data}
        estimatedItemSize={400}
        onEndReached={debouncedOnEndReached}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        keyExtractor={(item) => item.art_id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={getNumberOfColumns()}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworksContainer: {
    flex: 1,
  },
});
