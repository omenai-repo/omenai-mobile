import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useQuery } from '@tanstack/react-query';
import { getSalesActivityData } from 'services/overview/getSalesActivityData';
import { salesDataAlgorithm } from 'utils/utils_salesDataAlgorithm';
import { QK } from 'screens/artist/overview/ArtistOverview';

const { width } = Dimensions.get('window');

export default function SalesOverview({
  onLoadingChange,
}: {
  onLoadingChange?: (l: boolean) => void;
}) {
  const query = useQuery({
    queryKey: QK.salesOverview,
    queryFn: async () => {
      const res = await getSalesActivityData();
      return salesDataAlgorithm(res.data).map((m) => m.Revenue) as number[];
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const data = query.data ?? [];
  const labels = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [],
  );
  const maxValue = Math.max(0, ...data);
  const safeMax = maxValue || 1;

  const chartWidth = width - 40;
  const chartHeight = 100;
  const yAxisWidth = 40;
  const barWidth = data.length ? (chartWidth - yAxisWidth) / data.length : 1;

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0 });
  const [fade] = useState(new Animated.Value(0));
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`;

  const toggleTip = (x: number, y: number, value: number) => {
    if (tooltip.visible && tooltip.value === value && tooltip.x === x) {
      Animated.timing(fade, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setTooltip((t) => ({ ...t, visible: false })));
    } else {
      setTooltip({ visible: true, x, y, value });
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  if (query.isLoading && !query.data) {
    return (
      <View style={styles.skeletonContainer}>
        <View style={styles.header}>
          <View style={[styles.skeletonBlock, { width: 100, height: 20 }]} />
        </View>
        <View style={[styles.chart, { justifyContent: 'space-around' }]}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: Math.random() * 60 + 20,
                backgroundColor: '#E0E0E0',
                borderRadius: 4,
                marginBottom: 5,
              }}
            />
          ))}
        </View>
        <View style={styles.xAxis}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 20,
                height: 10,
                borderRadius: 2,
                backgroundColor: '#E0E0E0',
                marginHorizontal: 3,
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  if (data.every((v) => v === 0)) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center', marginTop: 40, marginBottom: 20 }]}>
          No sales data available for this year.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sales</Text>
      </View>
      <View style={styles.chart}>
        <View style={styles.yAxis}>
          {[0, maxValue / 2, maxValue].map((v, idx) => (
            <Text key={idx} style={[styles.yAxisLabel, { bottom: (chartHeight / 2) * idx - 8 }]}>
              {fmt(v)}
            </Text>
          ))}
        </View>

        <Svg width={chartWidth} height={chartHeight} style={{ backgroundColor: '#242731' }}>
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#8668E1" stopOpacity="1" />
              <Stop offset="1" stopColor="#232630" stopOpacity="0.5" />
            </LinearGradient>
          </Defs>

          {data.map((value, i) => {
            const barH = (value / safeMax) * chartHeight;
            const x = yAxisWidth + i * barWidth - barWidth + i + 10;
            const y = chartHeight - barH;
            return (
              <Rect
                key={i}
                x={x}
                y={y}
                width={barWidth - 10}
                height={barH}
                fill="url(#barGradient)"
                rx={4}
                onPress={() => toggleTip(x + barWidth / 2, y, value)}
              />
            );
          })}
        </Svg>
      </View>

      {tooltip.visible && (
        <Animated.View style={[styles.tooltip, { opacity: fade, left: tooltip.x, top: tooltip.y }]}>
          <Text style={styles.tooltipText}>{fmt(tooltip.value)} Sales</Text>
        </Animated.View>
      )}

      <View style={styles.xAxis}>
        {labels.map((l, i) => (
          <Text
            key={i}
            style={[
              styles.xAxisLabel,
              {
                width: barWidth,
                textAlign: 'center',
                left: yAxisWidth + i * barWidth - barWidth + i + 5,
              },
            ]}
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#242731',
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 10,
    marginHorizontal: 15,
  },
  skeletonContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 10,
    marginHorizontal: 15,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 18, color: '#FFFFFF', fontWeight: '600' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, position: 'relative' },
  yAxis: {
    position: 'absolute',
    left: 0,
    justifyContent: 'space-between',
    height: '100%',
    zIndex: 10,
  },
  yAxisLabel: { color: '#7C7C8D', fontSize: 12, textAlign: 'right', position: 'absolute', left: 0 },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    position: 'relative',
  },
  xAxisLabel: { color: '#7C7C8D', fontSize: 10, position: 'absolute', bottom: -20 },
  tooltip: { position: 'absolute', backgroundColor: '#fff', padding: 8, borderRadius: 4 },
  tooltipText: { color: '#000', fontSize: 12 },
  skeletonBlock: { backgroundColor: '#E0E0E0', borderRadius: 4 },
});
