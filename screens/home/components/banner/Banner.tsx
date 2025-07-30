import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  View,
  Linking,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { colors } from 'config/colors.config';
import { getPromotionalData } from 'services/promotional/getPromotionalContent';
import BannerLoader from './BannerLoader';
import BannerCard from './BannerCard';

const { width: windowWidth } = Dimensions.get('window');
const SIDE_PADDING = 15;
const CARD_GAP = 15;
const CARD_WIDTH = windowWidth - SIDE_PADDING * 2;

type BannerItemProps = {
  image?: string;
  headline: string;
  subheadline: string;
  cta: string;
};

export default function Banner({ reloadCount }: { reloadCount: number }) {
  const [data, setData] = useState<BannerItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    stopAutoplay();

    autoplayRef.current = setInterval(() => {
      const totalCards = data.length;
      const nextIndex = Math.round(scrollXValueRef.current / (CARD_WIDTH + CARD_GAP)) + 1;

      const offset = nextIndex < totalCards ? nextIndex * (CARD_WIDTH + CARD_GAP) : 0; // Reset to first card when at end

      flatListRef.current?.scrollToOffset({
        offset,
        animated: true,
      });
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const scrollXValueRef = useRef(0);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      scrollXValueRef.current = value;
    });

    return () => scrollX.removeAllListeners();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getPromotionalData();
      if (res?.isOk) setData(res.data);
      setLoading(false);
    }

    fetchData();
  }, [reloadCount]);

  useEffect(() => {
    if (data.length > 1) {
      startAutoplay();
      return () => stopAutoplay();
    }
  }, [data]);

  const handleClick = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <View>
      <View style={{ marginTop: 20 }}>
        {loading && data.length === 0 && <BannerLoader />}

        {!loading && data.length > 0 && (
          <Animated.FlatList
            ref={flatListRef}
            data={data}
            renderItem={({ item }) => (
              <BannerCard
                cta={item.cta}
                headline={item.headline}
                subheadline={item.subheadline}
                image={item.image}
                handleClick={handleClick}
              />
            )}
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
            contentContainerStyle={{
              paddingHorizontal: SIDE_PADDING,
            }}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
          />
        )}
      </View>

      {/* Pagination Dots */}
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
              style={[
                styles.indicator,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                },
              ]}
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
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
