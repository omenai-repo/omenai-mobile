import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
  ScrollView,
} from "react-native";
import MiniArtworkCard from "#components/artwork/MiniArtworkCard";
import EmptyArtworks from "./EmptyArtworks";
import Loader from "./Loader";
import tw from "twrnc";
import { useAppStore } from "#store/app/appStore";

import { useDevice } from "#hooks/useDevice";
import { colors } from "#config/colors.config";

const MIN_END_REACHED_OFFSET = 120;

function getEndReachedOffset(viewportHeight: number) {
  return Math.max(MIN_END_REACHED_OFFSET, viewportHeight * 0.35);
}

function isNearBottom(
  { layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent,
  viewportHeight: number,
) {
  const threshold = getEndReachedOffset(viewportHeight);
  return (
    layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold
  );
}

export default function ArtworksListing({
  data,
  onEndReached,
  onRefresh,
  loadingMore = false,
  hasMore = true,
}: {
  data: ArtworkSchemaTypes[];
  onEndReached?: () => void;
  onRefresh?: () => Promise<void>;
  loadingMore?: boolean;
  hasMore?: boolean;
}) {
  const { userType } = useAppStore();
  const { numColumns, horizontalPadding } = useDevice();
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const loadMorePendingRef = useRef(false);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);
  const scrollViewHeightRef = useRef(0);
  const lastScrollEventRef = useRef<NativeScrollEvent | null>(null);

  loadingMoreRef.current = loadingMore;
  hasMoreRef.current = hasMore;

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
    const timestamp = Date.now();
    const columns = Array.from({ length: numColumns }, (_, i) => ({
      id: `column-${timestamp}-${i}`,
      data: [] as ArtworkSchemaTypes[],
    }));
    data.forEach((item, index) => {
      columns[index % numColumns].data.push(item);
    });
    return columns;
  }, [data, numColumns]);

  useEffect(() => {
    if (!loadingMore) {
      loadMorePendingRef.current = false;
      setFooterLoading(false);
    }
  }, [loadingMore]);

  const requestLoadMore = useCallback(() => {
    if (!onEndReached || !hasMoreRef.current) return;
    if (loadingMoreRef.current || loadMorePendingRef.current) return;
    loadMorePendingRef.current = true;
    setFooterLoading(true);
    onEndReached();
  }, [onEndReached]);

  const checkScrollPosition = useCallback(
    (scrollEvent: NativeScrollEvent) => {
      if (!onEndReached || !hasMoreRef.current) return;
      lastScrollEventRef.current = scrollEvent;
      if (!isNearBottom(scrollEvent, scrollEvent.layoutMeasurement.height)) {
        return;
      }
      requestLoadMore();
    },
    [onEndReached, requestLoadMore],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      checkScrollPosition(event.nativeEvent);
    },
    [checkScrollPosition],
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      checkScrollPosition(event.nativeEvent);
    },
    [checkScrollPosition],
  );

  const tryFillShortContent = useCallback(
    (contentHeight: number) => {
      const viewportHeight = scrollViewHeightRef.current;
      if (viewportHeight <= 0 || contentHeight >= viewportHeight) return;
      requestLoadMore();
    },
    [requestLoadMore],
  );

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      tryFillShortContent(height);
      const lastEvent = lastScrollEventRef.current;
      if (
        lastEvent &&
        isNearBottom(lastEvent, lastEvent.layoutMeasurement.height)
      ) {
        requestLoadMore();
      }
    },
    [tryFillShortContent, requestLoadMore],
  );

  const handleScrollViewLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      scrollViewHeightRef.current = event.nativeEvent.layout.height;
      const lastEvent = lastScrollEventRef.current;
      if (lastEvent) {
        tryFillShortContent(lastEvent.contentSize.height);
      }
    },
    [tryFillShortContent],
  );

  const showFooterLoader =
    data.length > 0 && (footerLoading || loadingMore) && hasMore;

  const renderColumn = (columnData: ArtworkSchemaTypes[]) => (
    <View>
      {columnData.map((item) => (
        <View key={String(item.art_id)} style={tw`mb-2`}>
          <MiniArtworkCard
            title={item.title ?? ""}
            url={item.url ?? ""}
            artist={item.artist ?? ""}
            showPrice={item.pricing?.shouldShowPrice === "Yes"}
            price={item.pricing?.usd_price}
            impressions={item.impressions ?? 0}
            like_IDs={item.like_IDs ?? []}
            art_id={item.art_id}
            availability={(item as any).availability}
            galleryView={userType === "user" ? true : false}
            countdown={
              (item as any).exclusivity_status?.exclusivity_end_date
                ? ((item as any).exclusivity_status
                    .exclusivity_end_date as Date)
                : null
            }
          />
        </View>
      ))}
    </View>
  );

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`flex-1`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.black}
              colors={[colors.black]}
            />
          }
        >
          <EmptyArtworks />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleScrollViewLayout}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.black}
            colors={[colors.black]}
          />
        }
      >
        <View
          style={[
            tw`flex-row justify-between gap-2.5`,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          {columnsData.map(
            (column: { id: string; data: ArtworkSchemaTypes[] }) => (
              <View key={column.id} style={[{ flex: 1 / numColumns }]}>
                {renderColumn(column.data)}
              </View>
            ),
          )}
        </View>
        {showFooterLoader && (
          <View style={tw`items-center py-4`}>
            <Loader size={56} height={90} />
          </View>
        )}
        <View style={tw`mb-[5px]`} />
      </ScrollView>
    </View>
  );
}
