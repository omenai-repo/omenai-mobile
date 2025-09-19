import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { fetchHighlightData } from 'services/overview/fetchHighlightData';
import tw from 'twrnc';
import { useQueries } from '@tanstack/react-query';
import { QK } from '../Overview';

type HighlightCardProps = {
  onLoadingChange?: (loading: boolean) => void;
};

export const HighlightCard = ({ onLoadingChange }: HighlightCardProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 55) / 2;

  const results = useQueries({
    queries: (['artworks', 'sales', 'net', 'revenue'] as const).map((slice) => ({
      queryKey: QK.highlight(slice),
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

  const CardComp = ({
    title,
    icon,
    amount,
    color,
  }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    amount: number;
    color: string;
  }) => (
    <Animated.View
      // entering={FadeInUp.delay(100)}
      style={[
        tw`bg-black border border-[#ffffff10] rounded-[12px] px-[14px] py-[16px]`,
        { width: cardWidth },
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

  if (isLoadingAny) {
    return (
      <View style={tw`mx-[20px]`}>
        <View style={tw`flex-row gap-[15px] mb-[15px]`}>
          {[0, 1].map((idx) => (
            <Animated.View
              key={`loading-top-${idx}`}
              // entering={FadeIn.delay(idx * 100)}
              style={[styles.skeletonCard, { width: cardWidth }]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '50%', marginTop: 6 }]} />
              </View>
              <View style={styles.skeletonCircle} />
            </Animated.View>
          ))}
        </View>
        <View style={tw`flex-row gap-[15px]`}>
          {[2, 3].map((idx) => (
            <Animated.View
              key={`loading-bottom-${idx}`}
              // entering={FadeIn.delay(idx * 100)}
              style={[styles.skeletonCard, { width: cardWidth }]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '50%', marginTop: 6 }]} />
              </View>
              <View style={styles.skeletonCircle} />
            </Animated.View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={tw`mx-[20px]`}>
      <View style={tw`flex-row gap-[15px] mb-[15px]`}>
        <CardComp title="Revenue" icon="cash-outline" amount={revenue} color="#00C851" />
        <CardComp title="Net Earnings" icon="stats-chart-outline" amount={net} color="#FF4444" />
      </View>
      <View style={tw`flex-row gap-[15px]`}>
        <CardComp
          title="Total Artworks"
          icon="color-palette-outline"
          amount={artworks}
          color="#FFA500"
        />
        <CardComp title="Sold Artworks" icon="pricetags-outline" amount={sales} color="#00BFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginLeft: 10,
  },
  skeletonLine: { height: 10, width: '70%', borderRadius: 4, backgroundColor: '#333' },
});
