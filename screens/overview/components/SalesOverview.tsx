import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getSalesActivityData } from "services/overview/getSalesActivityData";
import { salesDataAlgorithm } from "utils/utils_salesDataAlgorithm";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import tw from "twrnc";

const { width } = Dimensions.get("window");
export default function SalesOverview({
  refreshCount,
}: {
  refreshCount: number;
}) {
  const [salesOverviewData, setSalesOverviewData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function handleFetchSalesData() {
      const data = await getSalesActivityData();
      const activityData = salesDataAlgorithm(data.data);
      let arr: number[] = [];
      activityData.map((month) => arr.push(month.Revenue));
      setSalesOverviewData(arr);
      setIsLoading(false);
    }

    handleFetchSalesData();
  }, [refreshCount]);

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const maxValue = Math.max(...salesOverviewData);

  // Chart configuration
  const chartWidth = width - 40; // Adjusting for padding
  const chartHeight = 100;
  const yAxisWidth = 40;
  const barWidth = (chartWidth - yAxisWidth) / salesOverviewData.length; // Each bar takes equal width

  const formatToK = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return num.toString();
  };

  if (isLoading)
    return (
      <View style={[styles.container, { paddingHorizontal: 20 }]}>
        <Text style={{ fontSize: 16, fontWeight: "400", marginBottom: 20 }}>
          Sales overview
        </Text>
        <View style={{ height: 200, backgroundColor: "#f5f5f5" }} />
      </View>
    );

  return (
    <>
      <Text style={tw`text-[18px] text-[#000] font-medium mb-[10px] mx-[20px]`}>
        Sales Overview
      </Text>
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
                style={[
                  styles.yAxisLabel,
                  { bottom: (chartHeight / 2) * index - 8 },
                ]}
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
              backgroundColor: "#242731",
            }}
          >
            <Defs>
              <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#8668E1" stopOpacity="1" />
                <Stop offset="1" stopColor="#232630" stopOpacity="0.5" />
              </LinearGradient>
            </Defs>

            {salesOverviewData.map((value, index) => {
              const barHeight = (value / maxValue) * chartHeight; // Bar height based on value
              const x = yAxisWidth + index * barWidth - barWidth + index + 10; // Correct positioning for bars
              const y = chartHeight - barHeight; // Bars grow upward

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth - 10} // Adding padding between bars
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx={4} // Rounded corners
                />
              );
            })}
          </Svg>
        </View>

        {/* X-Axis */}
        <View style={styles.xAxis}>
          {labels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                {
                  width: barWidth,
                  textAlign: "center",
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
    backgroundColor: "#242731",
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 10,
    marginHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    position: "relative",
  },
  yAxis: {
    position: "absolute",
    left: 0,
    justifyContent: "space-between",
    height: "100%",
    zIndex: 10,
  },
  yAxisLabel: {
    color: "#7C7C8D",
    fontSize: 12,
    textAlign: "right",
    position: "absolute",
    left: 0,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    position: "relative",
  },
  xAxisLabel: {
    color: "#7C7C8D",
    fontSize: 10,
    position: "absolute",
    bottom: -20, // Labels below the chart
  },
});
