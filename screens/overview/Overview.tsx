import { Animated, RefreshControl } from "react-native";
import tw from "twrnc";
import React, { useCallback, useRef, useState } from "react";

import WithGalleryModal from "#components/modal/WithGalleryModal";
import SalesOverview from "./components/SalesOverview";
import { HighlightCard } from "./components/HighlightCard";
import PopularArtworks from "./components/PopularArtworks";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import { useMoreSheet } from "#navigation/components/MoreSheetContext";

export default function Overview() {
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);
  const hasOpenedFromPull = useRef(false);
  const isDragging = useRef(false);
  const dragStartedAtTop = useRef(false);
  const dragStartedInHeader = useRef(false);
  const qc = useQueryClient();
  const { userSession } = useAppStore();
  const { openSearchSheet } = useMoreSheet();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("artworks", userSession?.id),
      }),
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("sales", userSession?.id),
      }),
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("net", userSession?.id),
      }),
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("revenue", userSession?.id),
      }),
      qc.invalidateQueries({ queryKey: QK.salesOverview(userSession?.id) }),

      qc.invalidateQueries({ queryKey: QK.popularArtworks(userSession?.id) }),
    ]);
  }, [qc, userSession?.id]);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    inflight.current += isLoading ? 1 : -1;
    if (inflight.current <= 0) {
      inflight.current = 0;
      requestAnimationFrame(() => setRefreshing(false));
    }
  }, []);

  const handleScroll = useCallback(
    (event: any) => {
      const yOffset = event.nativeEvent.contentOffset.y;
      if (
        isDragging.current &&
        dragStartedAtTop.current &&
        dragStartedInHeader.current &&
        yOffset < -45 &&
        !hasOpenedFromPull.current
      ) {
        hasOpenedFromPull.current = true;
        openSearchSheet();
        return;
      }

      if (yOffset > -10) {
        hasOpenedFromPull.current = false;
      }
    },
    [openSearchSheet],
  );

  const handleScrollBeginDrag = useCallback((event: any) => {
    isDragging.current = true;
    dragStartedAtTop.current = event.nativeEvent.contentOffset.y <= 0;
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    isDragging.current = false;
    dragStartedAtTop.current = false;
    dragStartedInHeader.current = false;
  }, []);

  const handleTouchStart = useCallback((event: any) => {
    // Only allow search pull gesture when touch begins in top header zone.
    dragStartedInHeader.current = event.nativeEvent.locationY <= 120;
  }, []);

  return (
    <WithGalleryModal>
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={tw`flex-1 bg-[#F7F7F7] px-5`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onTouchStart={handleTouchStart}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
        scrollEventThrottle={16}
      >
        <HighlightCard onLoadingChange={handleLoadingChange} />
        <SalesOverview onLoadingChange={handleLoadingChange} />
        <PopularArtworks onLoadingChange={handleLoadingChange} />
      </Animated.ScrollView>
    </WithGalleryModal>
  );
}
