import React, { useMemo, useState, useCallback, useEffect } from 'react';
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
import { useAppStore } from 'store/app/appStore';

const NUM_COLUMNS = getNumberOfColumns();

export default function ArtworksListing({
  data,
  onEndReached,
  onRefresh,
  loadingMore,
}: {
  data: ArtworkSchemaTypes[];
  onEndReached?: () => void;
  onRefresh?: () => Promise<void>;
  loadingMore?: boolean;
}) {
  const { userType } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const columnsData = useMemo(() => {
    const columns = Array.from({ length: NUM_COLUMNS }, () => [] as ArtworkSchemaTypes[]);
    data.forEach((item, index) => {
      columns[index % NUM_COLUMNS].push(item);
    });
    return columns;
  }, [data]);

  const debouncedOnEndReached = useMemo(() => {
    if (!onEndReached) return null;
    const fn = debounce(onEndReached, 300, { leading: false, trailing: true });
    return fn;
  }, [onEndReached]);

  useEffect(() => {
    return () => {
      debouncedOnEndReached?.cancel?.();
    };
  }, [debouncedOnEndReached]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!debouncedOnEndReached) return;
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
    if (isCloseToBottom) debouncedOnEndReached();
  };

  const renderColumn = (columnData: any[]) => (
    <FlatList
      data={columnData}
      keyExtractor={(item) => String(item.art_id)}
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
            galleryView={userType === 'user' ? true : false}
          />
        </View>
      )}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );

  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyArtworks size={20} writeUp="No artworks to display" />;
  }

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.container}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    gap: 10,
  },
  column: {
    flex: 1 / NUM_COLUMNS,
    paddingHorizontal: 4,
  },
  itemContainer: {
    marginBottom: 8,
  },
});
