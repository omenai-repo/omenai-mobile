import { Animated, RefreshControl } from "react-native";
import tw from "twrnc";
import React, { useCallback, useRef, useState } from "react";

import WithGalleryModal from "#components/modal/WithGalleryModal";
import SalesOverview from "./components/SalesOverview";
import { HighlightCard } from "./components/HighlightCard";
import PopularArtworks from "./components/PopularArtworks";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "#utils/core/queryKeys";
import { useAppStore } from "#store/app/appStore";

export default function Overview() {
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);
  const qc = useQueryClient();
  const { userSession } = useAppStore();

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

  return (
    <WithGalleryModal>
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={tw`flex-1 bg-[#F7F7F7] px-5`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HighlightCard onLoadingChange={handleLoadingChange} />
        <SalesOverview onLoadingChange={handleLoadingChange} />
        <PopularArtworks onLoadingChange={handleLoadingChange} />
      </Animated.ScrollView>
    </WithGalleryModal>
  );
}
