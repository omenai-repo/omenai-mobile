import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, View, Linking, Dimensions, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPromotionalData } from 'services/promotional/getPromotionalContent';
import BannerLoader from './BannerLoader';
import BannerCard from './BannerCard';
import { colors } from 'config/colors.config';
import { HOME_QK } from 'utils/queryKeys';
import { useAppStore } from 'store/app/appStore';

const { width: windowWidth } = Dimensions.get('window');
const SIDE_PADDING = 15;
const CARD_GAP = 15;
const CARD_WIDTH = windowWidth - SIDE_PADDING * 2;

type BannerItemProps = { image?: string; headline: string; subheadline: string; cta: string };

export default function Banner() {
  const { userSession } = useAppStore();
  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.banner(userSession?.id),
    queryFn: async () => {
      const res = await getPromotionalData();
      return res?.isOk ? (res.data as BannerItemProps[]) : [];
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const scrollXValueRef = useRef(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sub = scrollX.addListener(({ value }) => (scrollXValueRef.current = value));
    return () => {
      scrollX.removeListener(sub);
    };
  }, [scrollX]);

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  const startAutoplay = () => {
    stopAutoplay();
    if (data.length <= 1) return;
    autoplayRef.current = setInterval(() => {
      const total = data.length;
      const nextIndex = Math.round(scrollXValueRef.current / (CARD_WIDTH + CARD_GAP)) + 1;
      const offset = nextIndex < total ? nextIndex * (CARD_WIDTH + CARD_GAP) : 0;
      flatListRef.current?.scrollToOffset({ offset, animated: true });
    }, 5000);
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [data]);

  const handleClick = async (url: string) => {
    if (await Linking.canOpenURL(url)) Linking.openURL(url);
  };

  return (
    <View>
      <View style={{ marginTop: 20 }}>
        {isLoading && data.length === 0 && <BannerLoader />}

        {!isLoading && data.length > 0 && (
          <Animated.FlatList
            ref={flatListRef}
            data={data}
            renderItem={({ item }) => <BannerCard {...item} handleClick={handleClick} />}
            keyExtractor={(_, index) => `banner-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            bounces={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
          />
        )}
      </View>

      {/* Pagination */}
      <View style={styles.indicatorsContainer}>
        {data.map((_, i) => {
          const inputRange = [
            (CARD_WIDTH + CARD_GAP) * (i - 1),
            (CARD_WIDTH + CARD_GAP) * i,
            (CARD_WIDTH + CARD_GAP) * (i + 1),
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#D1D5DB', colors.primary_black, '#D1D5DB'],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.indicator, { width: dotWidth, backgroundColor: dotColor }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: { height: 8, borderRadius: 4, marginHorizontal: 4 },
});
