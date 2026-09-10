import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, View, Linking } from "react-native";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { getPromotionalData } from "#services/discovery/getPromotionalContent";
import BannerLoader from "./BannerLoader";
import BannerCard from "./BannerCard";
import { colors } from "#config/colors.config";
import { HOME_QK } from "#utils/core/queryKeys";
import { useAppStore } from "#store/app/appStore";
import { useDevice } from "#hooks/useDevice";

const SIDE_PADDING = 0;
const CARD_GAP = 15;

type BannerItemProps = {
  image?: string;
  headline: string;
  subheadline: string;
  cta: string;
};

export default function Banner() {
  const { userSession } = useAppStore();
  const { isTablet, width } = useDevice();

  // Calculate card width based on device type
  // Tablet: show 3 cards at a time, Phone: show 1 card
  const cardsToShow = isTablet ? 3 : 1;
  const totalGaps = CARD_GAP * (cardsToShow - 1);
  const CARD_WIDTH = (width - SIDE_PADDING * 2 - totalGaps) / cardsToShow;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.banner(userSession?.id),
    queryFn: async () => {
      const res = await getPromotionalData();
      return res?.isOk ? (res.data as BannerItemProps[]) : [];
    },
  });

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const scrollXValueRef = useRef(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sub = scrollX.addListener(
      ({ value }) => (scrollXValueRef.current = value),
    );
    return () => {
      scrollX.removeListener(sub);
    };
  }, [scrollX]);

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  const startAutoplay = () => {
    stopAutoplay();
    if (data.length <= cardsToShow) return;
    autoplayRef.current = setInterval(() => {
      const currentIndex = Math.round(scrollXValueRef.current / SNAP_INTERVAL);
      const maxIndex = data.length - cardsToShow;
      const nextIndex = currentIndex + 1;
      // If we've reached the end, loop back to start
      const offset = nextIndex > maxIndex ? 0 : nextIndex * SNAP_INTERVAL;
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
    <View style={tw`mt-6`}>
      {isLoading && data.length === 0 && (
        <BannerLoader isTablet={isTablet} cardWidth={CARD_WIDTH} />
      )}

      {!isLoading && data.length > 0 && (
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={({ item }) => (
            <BannerCard
              {...item}
              handleClick={handleClick}
              cardWidth={CARD_WIDTH}
            />
          )}
          keyExtractor={(item) => item.headline}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            },
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
          ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        />
      )}

      {/* Pagination - show dots based on scroll positions */}
      {!isTablet && (
        <View style={tw`mt-[15px] flex-row justify-center items-center`}>
          {data.map((item, i) => {
            const inputRange = [
              SNAP_INTERVAL * (i - 1),
              SNAP_INTERVAL * i,
              SNAP_INTERVAL * (i + 1),
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [6, 12, 6],
              extrapolate: "clamp",
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: ["#D1D5DB", colors.primary_black, "#D1D5DB"],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={`indicator-${item.headline}`}
                style={[
                  tw`h-1.5 rounded-full mx-0.5`,
                  { width: dotWidth, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>
      )}
      {/* Tablet: show dots for scroll positions (total items - visible + 1) */}
      {isTablet && data.length > cardsToShow && (
        <View style={tw`mt-[15px] flex-row justify-center items-center`}>
          {(() => {
            const indicatorsCount = data.length - cardsToShow + 1;
            const indicators = Array.from(
              { length: indicatorsCount },
              (_, k) => `tablet-ind-${k}`,
            );

            return indicators.map((id, i) => {
              const inputRange = [
                SNAP_INTERVAL * (i - 1),
                SNAP_INTERVAL * i,
                SNAP_INTERVAL * (i + 1),
              ];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [6, 12, 6],
                extrapolate: "clamp",
              });
              const dotColor = scrollX.interpolate({
                inputRange,
                outputRange: ["#D1D5DB", colors.primary_black, "#D1D5DB"],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={id}
                  style={[
                    tw`h-1.5 rounded-full mx-0.5`,
                    { width: dotWidth, backgroundColor: dotColor },
                  ]}
                />
              );
            });
          })()}
        </View>
      )}
    </View>
  );
}
