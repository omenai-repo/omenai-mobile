// screens/overview/HighlightCard.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import CardComp from "#components/general/CardComp";
import { useDevice } from "#hooks/useDevice";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { fetchArtistHighlightData } from "#services/marketplace/overview/fetchArtistHighlightData";
import { QK } from "#utils/core/queryKeys";
import { useAppStore } from "#store/app/appStore";

import { SkeletonHighlightCard } from "#components/loaders/SkeletonHighlightCard";

export const HighlightCard = ({
  onLoadingChange,
}: {
  onLoadingChange?: (l: boolean) => void;
}) => {
  const { isTablet, width } = useDevice();
  const { userSession } = useAppStore();

  const qSales = useQuery({
    queryKey: QK.highlightArtist("sales", userSession?.id),
    queryFn: () => fetchArtistHighlightData("sales"),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
  const qNet = useQuery({
    queryKey: QK.highlightArtist("net", userSession?.id),
    queryFn: () => fetchArtistHighlightData("net"),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
  const qRev = useQuery({
    queryKey: QK.highlightArtist("revenue", userSession?.id),
    queryFn: () => fetchArtistHighlightData("revenue"),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
  const qBal = useQuery({
    queryKey: QK.highlightArtist("balance", userSession?.id),
    queryFn: () => fetchArtistHighlightData("balance"),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const isLoading =
    qSales.isLoading || qNet.isLoading || qRev.isLoading || qBal.isLoading;
  const isFetching =
    qSales.isFetching || qNet.isFetching || qRev.isFetching || qBal.isFetching;

  useEffect(() => {
    onLoadingChange?.(
      isFetching ||
      (isLoading && !(qSales.data && qNet.data && qRev.data && qBal.data))
    );
  }, [
    isLoading,
    isFetching,
    qSales.data,
    qNet.data,
    qRev.data,
    qBal.data,
    onLoadingChange,
  ]);

  const soldArtwork = qSales.data ?? 0;
  const net = qNet.data ?? 0;
  const revenue = qRev.data ?? 0;
  const wallet = qBal.data ?? 0;

  const gap = 15;
  const paddingHorizontal = 20;
  const cols = isTablet ? 4 : 2;
  // Calculate total space taken by gaps between columns
  const totalGap = gap * (cols - 1);
  // Calculate total horizontal padding (left + right)
  const totalPadding = paddingHorizontal * 2;
  // Calculate width for each card
  const cardWidth = (width - totalPadding - totalGap) / cols;

  if (isLoading && !(qSales.data && qNet.data && qRev.data && qBal.data)) {
    return (
      <View
        style={[tw`mt-2 mb-[15px] flex-row flex-wrap`, {
          gap,
        }]}
      >
        {["shim-1", "shim-2", "shim-3", "shim-4"].map((key) => (
          <SkeletonHighlightCard key={key} cardWidth={cardWidth} />
        ))}
      </View>
    );
  }

  return (
    <View
      style={[tw`mt-2 mb-[15px] flex-row flex-wrap`, {
        gap,
      }]}
    >
      <CardComp
        title="Wallet Balance"
        icon="wallet-outline"
        amount={wallet}
        color="#FFD700"
        cardWidth={cardWidth}
      />
      <CardComp
        title="Revenue"
        icon="cash-outline"
        amount={revenue}
        color="#00C851"
        cardWidth={cardWidth}
      />
      <CardComp
        title="Net Earnings"
        icon="stats-chart-outline"
        amount={net}
        color="#FF4444"
        cardWidth={cardWidth}
      />
      <CardComp
        title="Sold Artworks"
        icon="pricetags-outline"
        amount={soldArtwork}
        color="#00BFFF"
        cardWidth={cardWidth}
      />
    </View>
  );
};
