// screens/overview/HighlightCard.tsx
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDevice } from "#hooks/useDevice";
import Animated from "react-native-reanimated";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchArtistHighlightData } from "#services/overview/fetchArtistHighlightData";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

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
  });
  const qNet = useQuery({
    queryKey: QK.highlightArtist("net", userSession?.id),
    queryFn: () => fetchArtistHighlightData("net"),
  });
  const qRev = useQuery({
    queryKey: QK.highlightArtist("revenue", userSession?.id),
    queryFn: () => fetchArtistHighlightData("revenue"),
  });
  const qBal = useQuery({
    queryKey: QK.highlightArtist("balance", userSession?.id),
    queryFn: () => fetchArtistHighlightData("balance"),
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

  const CardComp = ({
    title,
    icon,
    amount,
    color,
  }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    amount: number | string;
    color: string;
  }) => (
    <Animated.View
      // entering={FadeInUp.delay(100)}
      style={[
        tw`rounded-[12px] px-[14px] py-[16px]`,
        {
          width: cardWidth,
          backgroundColor: colors.black,
          borderColor: "#ffffff10",
        },
      ]}
    >
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[13px] text-[#FFFFFF99] mb-[2px]`}>{title}</Text>
          <Text style={tw`text-[18px] text-white font-bold`}>{amount}</Text>
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

  if (isLoading && !(qSales.data && qNet.data && qRev.data && qBal.data)) {
    return (
      <View
        style={tw.style(`mx-[20px] mt-[20px] mb-[15px] flex-row flex-wrap`, {
          gap,
        })}
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <Animated.View
            key={`loading-${idx}`}
            // entering={FadeIn.delay(idx * 100)}
            style={[styles.skeletonCard, { width: cardWidth }]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.skeletonLine} />
              <View
                style={[styles.skeletonLine, { width: "50%", marginTop: 6 }]}
              />
            </View>
            <View style={styles.skeletonCircle} />
          </Animated.View>
        ))}
      </View>
    );
  }

  return (
    <View
      style={tw.style(`mx-[20px] mt-[20px] mb-[15px] flex-row flex-wrap`, {
        gap,
      })}
    >
      <CardComp
        title="Wallet Balance"
        icon="wallet-outline"
        amount={wallet}
        color="#FFD700"
      />
      <CardComp
        title="Revenue"
        icon="cash-outline"
        amount={revenue}
        color="#00C851"
      />
      <CardComp
        title="Net Earnings"
        icon="stats-chart-outline"
        amount={net}
        color="#FF4444"
      />
      <CardComp
        title="Sold Artworks"
        icon="pricetags-outline"
        amount={soldArtwork}
        color="#00BFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
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
  skeletonLine: {
    height: 10,
    width: "70%",
    borderRadius: 4,
    backgroundColor: "#333",
  },
});
