import React, { useMemo, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';
import MiniArtworkCard from 'components/artwork/MiniArtworkCard';
import EmptyArtworks from './EmptyArtworks';
import Loader from './Loader';
import { debounce } from 'lodash';
import tw from 'twrnc';
import { getNumberOfColumns } from 'utils/utils_screen';

const NUM_COLUMNS = getNumberOfColumns(); // Number of columns in the masonry layout

export default function ArtworksListing({
  data,
  loadingMore,
  onEndReached,
  onRefresh,
}: {
  data: ArtworkSchemaTypes[];
  loadingMore?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => Promise<void>;
}) {
  const [refreshing, setRefreshing] = useState(false);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  }, [onRefresh]);

  // Split data into columns
  const columnsData = useMemo(() => {
    const columns = Array.from({ length: NUM_COLUMNS }, () => [] as any[]);
    data.forEach((item, index) => {
      columns[index % NUM_COLUMNS].push(item); // Distribute items evenly
    });
    return columns;
  }, [data]);

  // Debounced callback for onEndReached
  const debouncedOnEndReached = useMemo(
    () => (onEndReached ? debounce(onEndReached, 300) : null),
    [onEndReached],
  );

  // Detect when the user scrolls near the bottom
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200; // Trigger 200px before bottom
    if (isCloseToBottom && debouncedOnEndReached) {
      debouncedOnEndReached();
    }
  };

  const renderColumn = (columnData: any[]) => (
    <FlatList
      data={columnData}
      keyExtractor={(item) => item.art_id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <MiniArtworkCard
            title={item.title}
            url={item.url}
            artist={item.artist}
            showPrice={item.pricing.shouldShowPrice === 'Yes'}
            price={item.pricing.usd_price}
            impressions={item.impressions}
            like_IDs={item.like_IDs}
            art_id={item.art_id}
            availability={item.availability}
          />
        </View>
      )}
      scrollEnabled={false} // Disable individual column scrolling
      showsVerticalScrollIndicator={false}
    />
  );

  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyArtworks size={20} writeUp="No artworks to display" />;
  }

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16} // Higher frequency scroll event
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.container}>
        {/* Render each column */}
        {columnsData.map((column, index) => (
          <View key={index} style={styles.column}>
            {renderColumn(column)}
          </View>
        ))}
      </View>
      {/* Loader at the bottom */}
      {loadingMore && <Loader size={150} height={0} />}
      <View style={tw`mb-[150px]`} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange columns horizontally
    justifyContent: 'space-between',
  },
  column: {
    flex: 1 / NUM_COLUMNS, // Each column takes equal space
    paddingHorizontal: 4,
  },
  itemContainer: {
    marginBottom: 8, // Spacing between items vertically
  },
});
