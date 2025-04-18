import { Dimensions, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getSalesActivityData } from 'services/overview/getSalesActivityData';
import { salesDataAlgorithm } from 'utils/utils_salesDataAlgorithm';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

const artistData = [
  { Revenue: 0, name: 'Jan' },
  { Revenue: 0, name: 'Feb' },
  { Revenue: 6124, name: 'Mar' },
  { Revenue: 0, name: 'Apr' },
  { Revenue: 0, name: 'May' },
  { Revenue: 0, name: 'Jun' },
  { Revenue: 0, name: 'Jul' },
  { Revenue: 0, name: 'Aug' },
  { Revenue: 0, name: 'Sep' },
  { Revenue: 0, name: 'Oct' },
  { Revenue: 0, name: 'Nov' },
  { Revenue: 0, name: 'Dec' },
];

export default function SalesOverview({
  refreshCount,
  userType,
}: {
  refreshCount: number;
  userType: string;
}) {
  const [salesOverviewData, setSalesOverviewData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    value: 0,
  });
  const [fadeAnim] = useState(new Animated.Value(0)); // For tooltip animation

  useEffect(() => {
    setIsLoading(true);
    async function handleFetchSalesData() {
      const data = await getSalesActivityData();
      const activityData = userType === 'gallery' ? salesDataAlgorithm(data.data) : artistData;
      const arr = activityData.map((month) => month.Revenue);
      setSalesOverviewData(arr);
      setIsLoading(false);
    }
    handleFetchSalesData();
  }, [refreshCount]);

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const maxValue = Math.max(...salesOverviewData);

  // Chart configuration
  const chartWidth = width - 40;
  const chartHeight = 100;
  const yAxisWidth = 40;
  const barWidth = (chartWidth - yAxisWidth) / salesOverviewData.length;

  const formatToK = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return num.toString();
  };

  const handleBarPress = (x: number, y: number, value: number) => {
    setTooltip({ visible: true, x, y, value });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideTooltip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setTooltip({ ...tooltip, visible: false }));
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
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
                backgroundColor: '#3C3F4E',
                borderRadius: 4,
                marginBottom: 5,
              }}
            />
          ))}
        </View>

        <View style={styles.xAxis}>
          {Array.from({ length: 12 }).map((_, index) => (
            <View
              key={index}
              style={{
                width: 20,
                height: 10,
                borderRadius: 2,
                backgroundColor: '#3C3F4E',
                marginHorizontal: 3,
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <>
      {/* <Text style={tw`text-[18px] text-[#000] font-medium mb-[10px] mx-[20px]`}>
        Sales Overview
      </Text> */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sales</Text>
        </View>

        {/* Chart */}
        <View style={styles.chart}>
          {/* Y-Axis */}
          <View style={styles.yAxis}>
            {[0, maxValue / 2, maxValue].map((value, index) => (
              <Text
                key={index}
                style={[styles.yAxisLabel, { bottom: (chartHeight / 2) * index - 8 }]}
              >
                {formatToK(value)}
              </Text>
            ))}
          </View>

          {/* Bars */}
          <Svg
            width={chartWidth}
            height={chartHeight}
            style={{
              backgroundColor: '#242731',
            }}
          >
            <Defs>
              <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#8668E1" stopOpacity="1" />
                <Stop offset="1" stopColor="#232630" stopOpacity="0.5" />
              </LinearGradient>
            </Defs>

            {salesOverviewData.map((value, index) => {
              const barHeight = (value / maxValue) * chartHeight;
              const x = yAxisWidth + index * barWidth - barWidth + index + 10;
              const y = chartHeight - barHeight;

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth - 10}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx={4}
                  onPressIn={() => handleBarPress(x + barWidth / 2, y, value)}
                  onPressOut={hideTooltip}
                />
              );
            })}
          </Svg>
        </View>

        {/* Tooltip */}
        {tooltip.visible && (
          <Animated.View
            style={[
              styles.tooltip,
              {
                opacity: fadeAnim,
                left: tooltip.x,
                top: tooltip.y,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{formatToK(tooltip.value)} Sales</Text>
          </Animated.View>
        )}

        {/* X-Axis */}
        <View style={styles.xAxis}>
          {labels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                {
                  width: barWidth,
                  textAlign: 'center',
                  left: yAxisWidth + index * barWidth - barWidth + index + 5,
                },
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    position: 'relative',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    justifyContent: 'space-between',
    height: '100%',
    zIndex: 10,
  },
  yAxisLabel: {
    color: '#7C7C8D',
    fontSize: 12,
    textAlign: 'right',
    position: 'absolute',
    left: 0,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    position: 'relative',
  },
  xAxisLabel: {
    color: '#7C7C8D',
    fontSize: 10,
    position: 'absolute',
    bottom: -20,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
  },
  tooltipText: {
    color: '#000',
    fontSize: 12,
  },
  skeletonBlock: {
    backgroundColor: '#3C3F4E',
    borderRadius: 4,
  },
});
