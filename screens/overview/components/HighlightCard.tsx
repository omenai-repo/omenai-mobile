import React, { useEffect, useState } from "react";
import { View, InteractionManager } from "react-native";
import CardComp from "#components/general/CardComp";
import { fetchHighlightData } from "#services/overview/fetchHighlightData";
import tw from "twrnc";
import { useQueries } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

import { useDevice } from "#hooks/useDevice";

import { SkeletonHighlightCard } from "#components/loaders/SkeletonHighlightCard";

type HighlightCardProps = {
  onLoadingChange?: (loading: boolean) => void;
};

export const HighlightCard = React.memo(function HighlightCard({
  onLoadingChange,
}: HighlightCardProps) {
  const [interactionsComplete, setInteractionsComplete] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setInteractionsComplete(true);
    });
    return () => task.cancel();
  }, []);
  const { isTablet, width } = useDevice();
  const { userSession } = useAppStore();

  const results = useQueries({
    queries: (["artworks", "sales", "net", "revenue"] as const).map(
      (slice) => ({
        queryKey: QK.highlightGallery(slice, userSession?.id),
        queryFn: () => fetchHighlightData(slice),
        staleTime: 30_000,
        gcTime: 10 * 60_000,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        select: (d: number) => d ?? 0,
        enabled: interactionsComplete, // Defer fetching until navigation transitions complete
      }),
    ),
  });

  const isFetchingAny = results.some((r) => r.isFetching);
  const isLoadingAny = results.some((r) => r.isLoading && !r.data);

  useEffect(() => {
    onLoadingChange?.(isFetchingAny || isLoadingAny);
  }, [isFetchingAny, isLoadingAny, onLoadingChange]);

  const [artworks, sales, net, revenue] = results.map((r) => r.data ?? 0);

  const gap = 15;
  const paddingHorizontal = 20;
  const cols = isTablet ? 4 : 2;
  // Calculate total space taken by gaps between columns
  const totalGap = gap * (cols - 1);
  // Calculate total horizontal padding (left + right)
  const totalPadding = paddingHorizontal * 2;
  // Calculate width for each card
  const cardWidth = (width - totalPadding - totalGap) / cols;

  const allCards = [
    {
      title: "Revenue",
      icon: "cash-outline" as const,
      amount: revenue,
      color: "#00C851",
    },
    {
      title: "Net Earnings",
      icon: "stats-chart-outline" as const,
      amount: net,
      color: "#FF4444",
    },
    {
      title: "Total Artworks",
      icon: "color-palette-outline" as const,
      amount: artworks,
      color: "#FFA500",
    },
    {
      title: "Sold Artworks",
      icon: "pricetags-outline" as const,
      amount: sales,
      color: "#00BFFF",
    },
  ];

  if (isLoadingAny) {
    return (
      <View
        style={[tw`mt-5 mb-[15px] flex-row flex-wrap`, {
          gap,
        }]}
      >
        {["shim1", "shim2", "shim3", "shim4"].map((key) => (
          <SkeletonHighlightCard key={key} cardWidth={cardWidth} />
        ))}
      </View>
    );
  }

  return (
    <View
      style={[tw`mt-5 mb-[15px] flex-row flex-wrap`, {
        gap,
      }]}
    >
      {allCards.map((c) => (
        <CardComp
          key={c.title}
          title={c.title}
          icon={c.icon}
          amount={c.amount}
          color={c.color}
          cardWidth={cardWidth}
        />
      ))}
    </View>
  );
});
