import { RefreshControl, View } from "react-native";
import tw from "twrnc";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import WithGalleryModal from "#components/modal/WithGalleryModal";
import Header from "#components/header/Header";
import SalesOverview from "./components/SalesOverview";
import { HighlightCard } from "./components/HighlightCard";
import PopularArtworks from "./components/PopularArtworks";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";

export default function Overview() {
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);
  const qc = useQueryClient();
  const { userSession } = useAppStore();
  const { scrollY, onScroll } = useScrollY();

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
  }, [qc]);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    inflight.current += isLoading ? 1 : -1;
    if (inflight.current <= 0) {
      inflight.current = 0;
      requestAnimationFrame(() => setRefreshing(false));
    }
  }, []);

  const sections = useMemo(
    () => [
      { key: "header" },
      { key: "highlights" },
      { key: "sales" },
      { key: "popular" },
    ],
    []
  );

  const renderSection = useCallback(
    ({ item }: { item: { key: string } }) => {
      switch (item.key) {
        case "header":
          return <Header />;
        case "highlights":
          return <HighlightCard onLoadingChange={handleLoadingChange} />;
        case "sales":
          return <SalesOverview onLoadingChange={handleLoadingChange} />;
        case "popular":
          return <PopularArtworks onLoadingChange={handleLoadingChange} />;
        default:
          return null;
      }
    },
    [handleLoadingChange]
  );

  return (
    <WithGalleryModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
        <FlashList
          data={sections}
          renderItem={renderSection}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={onScroll}
          scrollEventThrottle={16}
          // @ts-expect-error - FlashList expects estimatedItemSize but type definition might be outdated
          estimatedItemSize={380}
        />
      </View>
    </WithGalleryModal>
  );
}
