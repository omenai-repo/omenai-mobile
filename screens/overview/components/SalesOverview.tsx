import { useDevice } from "#hooks/useDevice";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleProp,
  Text,
  View,
  ViewStyle,
  InteractionManager,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getSalesActivityData } from "#services/overview/getSalesActivityData";
import { salesDataAlgorithm } from "#utils/utils_salesDataAlgorithm";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import { BarChart } from "react-native-gifted-charts";
import { Dropdown } from "react-native-element-dropdown";
import { colors } from "#config/colors.config";
import tw from "twrnc";
import { ChartTooltip } from "./ChartTooltip";

const currentYear = new Date().getFullYear();
const years = [
  { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
  { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
  { label: currentYear.toString(), value: currentYear.toString() },
];

export default React.memo(function SalesOverview({
  onLoadingChange,
  customWidth,
  style,
}: {
  onLoadingChange?: (l: boolean) => void;
  customWidth?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { userSession } = useAppStore();
  const { width, isTablet } = useDevice();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [interactionsComplete, setInteractionsComplete] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setInteractionsComplete(true);
    });
    return () => task.cancel();
  }, []);

  const activeWidth = customWidth ?? width - 32; // If customWidth provided, use it. Else use screen width - 32 (margin)
  const chartWidth = activeWidth - 32; // Subtract internal padding (px-4 = 32)

  const query = useQuery({
    queryKey: QK.salesOverview(userSession?.id, selectedYear),
    queryFn: async () => {
      const res = await getSalesActivityData(selectedYear);
      return salesDataAlgorithm(res.data);
    },
    enabled: interactionsComplete, // Defer fetching until navigation finishes
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const data = query.data ?? [];
  const isEmpty = data.every((item: any) => item.value === 0);

  const customLabel = useCallback(
    (val: string) => {
      return (
        <View
          style={[tw`w-[50px] items-center`, isTablet && { marginLeft: 10 }]}
        >
          <Text
            style={tw`text-gray-400 font-medium text-[11px] mb-1.5 text-center`}
          >
            {val}
          </Text>
        </View>
      );
    },
    [isTablet]
  );

  const formattedData = useMemo(
    () =>
      data.map((item: any, index: number) => ({
        value: item.value,
        label: item.label,
        labelComponent: () => customLabel(item.label),
        index,
      })),
    [data, customLabel]
  );

  const formatYAxisLabel = useCallback((label: string) => {
    const value = Number.parseFloat(label);
    if (value < 0) return "";
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  }, []);

  const renderHeader = useCallback(
    () => (
      <View style={tw`flex-row justify-between items-center mb-5 z-20`}>
        <Text style={tw`text-lg text-black font-medium`}>Sales Revenue</Text>
        <Dropdown
          style={tw`h-[35px] w-[90px] border border-[#E0E0E0] rounded-sm px-2`}
          containerStyle={tw`rounded-sm mt-1`}
          data={years}
          labelField="label"
          valueField="value"
          value={selectedYear}
          onChange={(item) => setSelectedYear(item.value)}
          placeholder="Year"
          placeholderStyle={tw`text-sm text-[#333]`}
          selectedTextStyle={tw`text-sm text-[#333]`}
          itemTextStyle={tw`text-sm text-[#333]`}
          iconStyle={tw`w-5 h-5`}
        />
      </View>
    ),
    [selectedYear]
  );

  const maxDataValue = Math.max(...formattedData.map((d) => d.value));
  const chartMaxValue = maxDataValue > 0 ? maxDataValue * 2 : 1000;

  const tooltipMaxValue = useMemo(
    () => Math.max(0, ...formattedData.map((d) => d.value)),
    [formattedData]
  );

  const renderTooltip = useCallback(
    (item: any, index: number) => {
      return (
        <View
          style={{
            marginLeft: -15, // Center tooltip roughly over bar
            backgroundColor: "transparent",
          }}
        >
          <ChartTooltip
            value={item.value}
            label={item.label}
            index={index}
            maxValue={tooltipMaxValue}
            totalBars={formattedData.length}
          />
        </View>
      );
    },
    [tooltipMaxValue, formattedData.length]
  );

  if (query.isLoading && !query.data) {
    return (
      <View style={[tw`bg-white rounded-sm py-5 px-4`, style]}>
        {renderHeader()}
        <View
          style={[
            tw`flex-row items-end h-[100px] relative`,
            { justifyContent: "space-around", height: 260 },
          ]}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: Math.random() * 60 + 20,
                backgroundColor: "#E0E0E0",
                borderRadius: 4,
                marginBottom: 5,
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[tw`bg-white rounded-sm py-5 px-4 overflow-hidden`, style]}
    >
      {renderHeader()}

      {isEmpty ? (
        <View style={tw`h-[200px] justify-center items-center`}>
          <Text style={tw`text-gray-400 text-sm`}>
            No sales data available for {selectedYear}.
          </Text>
        </View>
      ) : (
        <View style={tw`overflow-hidden`}>
          <BarChart
            data={formattedData}
            barWidth={22}
            spacing={isTablet ? 40 : 20}
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{
              color: "#9CA3AF",
              fontSize: 11,
              fontWeight: "500",
            }}
            maxValue={chartMaxValue}
            noOfSections={4}
            formatYLabel={formatYAxisLabel}
            isAnimated
            roundedTop={false}
            barBorderTopLeftRadius={3}
            barBorderTopRightRadius={3}
            animationDuration={1200}
            frontColor={colors.black}
            showValuesAsTopLabel={false}
            renderTooltip={renderTooltip}
            width={chartWidth}
            height={200}
            labelWidth={40}
            xAxisLabelTextStyle={{
              color: "#9CA3AF",
              fontSize: 11,
              fontWeight: "500",
              textAlign: "center",
            }}
          />
        </View>
      )}
    </View>
  );
});
