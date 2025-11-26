import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import { fetchHighlightData } from "services/overview/fetchHighlightData";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { useQueries } from "@tanstack/react-query";
import { QK } from "utils/queryKeys";
import { useAppStore } from "store/app/appStore";

type CardConfig = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  amount: number;
  color: string;
};

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunkedArray: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArray.push(arr.slice(i, i + size));
  }
  return chunkedArray;
};

type HighlightCardProps = {
  onLoadingChange?: (loading: boolean) => void;
};

export const HighlightCard = ({ onLoadingChange }: HighlightCardProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 55) / 2;
  const { userSession } = useAppStore();

  const results = useQueries({
    queries: (["artworks", "sales", "net", "revenue"] as const).map((slice) => ({
      queryKey: QK.highlightGallery(slice, userSession?.id),
      queryFn: () => fetchHighlightData(slice),
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      select: (d: number) => d ?? 0,
    })),
  });

  const isFetchingAny = results.some((r) => r.isFetching);
  const isLoadingAny = results.some((r) => r.isLoading && !r.data);

  useEffect(() => {
    onLoadingChange?.(isFetchingAny || isLoadingAny);
  }, [isFetchingAny, isLoadingAny, onLoadingChange]);

  const [artworks, sales, net, revenue] = results.map((r) => r.data ?? 0);

  const CardComp = ({ title, icon, amount, color }: CardConfig) => (
    <Animated.View
      // entering={FadeInUp.delay(100)}
      style={[
        tw`rounded-[12px] px-[14px] py-[16px]`,
        { width: cardWidth, backgroundColor: colors.black, borderColor: "#ffffff10" },
      ]}
    >
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[13px] text-[#FFFFFF99] mb-[2px]`}>{title}</Text>
          <Text style={tw`text-[18px] text-white font-bold`}>{amount.toLocaleString()}</Text>
        </View>
        <View
          style={[
            tw`h-[36px] w-[36px] rounded-full justify-center items-center`,
            { backgroundColor: `${color}22` },
          ]}
        >
          <Ionicons name={icon} size={18} color={color} />
        </View>
      </View>
    </Animated.View>
  );

  const allCards = [
    { title: "Revenue", icon: "cash-outline" as const, amount: revenue, color: "#00C851" },
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

  const cardRows = chunkArray(allCards, 2);

  if (isLoadingAny) {
    const skeletonItems = [0, 1, 2, 3];
    const skeletonRows = chunkArray(skeletonItems, 2);

    return (
      <View style={tw`mx-[20px]`}>
        {skeletonRows.map((rowItems, rIdx) => (
          <View
            key={`s-row-${rIdx}`}
            style={tw`flex-row gap-[15px] ${rIdx === 0 ? "mb-[15px]" : ""}`}
          >
            {rowItems.map((_idx, col) => (
              <Animated.View
                key={`loading-${rIdx * 2 + col}`}
                style={[styles.skeletonCard, { width: cardWidth }]}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, { width: "50%", marginTop: 6 }]} />
                </View>
                <View style={styles.skeletonCircle} />
              </Animated.View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={tw`mx-[20px]`}>
      {cardRows.map((rowItems, rIdx) => (
        <View key={`row-${rIdx}`} style={tw`flex-row gap-[15px] ${rIdx === 0 ? "mb-[15px]" : ""}`}>
          {rowItems.map((c) => (
            <CardComp
              key={c.title}
              title={c.title}
              icon={c.icon}
              amount={c.amount}
              color={c.color}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skeletonCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    marginLeft: 10,
  },
  skeletonLine: { height: 10, width: "70%", borderRadius: 4, backgroundColor: "#333" },
});
