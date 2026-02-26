import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { colors } from "#config/colors.config";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

type PayoutSummaryProps = {
  transactions: any[];
  currency?: string;
};

const { width } = Dimensions.get("window");
// Parent container usually has paddingHorizontal: 20, so available width is width - 40.
// We want the card to take up the full available space.
const CARD_WIDTH = width - 40;
const GAP = 10;
const SNAP_INTERVAL = CARD_WIDTH + GAP;

export default function PayoutSummary({
  transactions,
  currency = "USD",
}: Readonly<PayoutSummaryProps>) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalGross = transactions.reduce(
    (sum, t) => sum + t.trans_pricing.unit_price,
    0,
  );

  const totalNet = transactions.reduce(
    (sum, t) => sum + (t.trans_pricing.unit_price - t.trans_pricing.commission),
    0,
  );

  const data = [
    { label: "Gross earnings", value: utils_formatPrice(totalGross, currency) },
    { label: "Net earnings", value: utils_formatPrice(totalNet, currency) },
    { label: "Transactions", value: transactions.length.toString() },
  ];

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0;
      }

      scrollViewRef.current?.scrollTo({
        x: nextIndex * SNAP_INTERVAL,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex, data.length]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SNAP_INTERVAL);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        contentContainerStyle={{ gap: GAP }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {data.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </ScrollView>

      {/* Pagination Indicators */}
      <View style={styles.paginationContainer}>
        {data.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex ? colors.primary_black : colors.grey50,
                width: index === activeIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function SummaryCard({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey50,
    justifyContent: "center",
    alignItems: "flex-start", // Explicitly left align
    height: 100,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    color: colors.grey,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: "left",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary_black,
    textAlign: "left",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
});
