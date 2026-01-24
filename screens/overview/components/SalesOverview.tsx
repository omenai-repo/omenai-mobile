import { useDevice } from "#hooks/useDevice";
import React, { useEffect, useState } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getSalesActivityData } from "#services/overview/getSalesActivityData";
import { salesDataAlgorithm } from "#utils/utils_salesDataAlgorithm";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import { LineChart } from "react-native-gifted-charts";
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

export default function SalesOverview({
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

  const activeWidth = customWidth ?? width - 32; // If customWidth provided, use it. Else use screen width - 32 (margin)
  const chartWidth = activeWidth - 32; // Subtract internal padding (px-4 = 32)

  const query = useQuery({
    queryKey: QK.salesOverview(userSession?.id, selectedYear),
    queryFn: async () => {
      const res = await getSalesActivityData(selectedYear);
      return salesDataAlgorithm(res.data);
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const data = query.data ?? [];
  const isEmpty = data.every((item: any) => item.value === 0);

  const customLabel = (val: string) => {
    return (
      <View style={[tw`w-[50px] items-center`, isTablet && { marginLeft: 10 }]}>
        <Text
          style={tw`text-gray-400 font-medium text-[11px] mb-1.5 text-center`}
        >
          {val}
        </Text>
      </View>
    );
  };

  const formattedData = data.map((item: any, index: number) => ({
    value: item.value,
    label: item.label,
    labelComponent: () => customLabel(item.label),
    index,
  }));

  const formatYAxisLabel = (label: string) => {
    const value = Number.parseFloat(label);
    if (value < 0) return "";
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const renderTooltip = (items: any) => {
    const item = items[0];
    return (
      <ChartTooltip value={item.value} label={item.label} index={item.index} />
    );
  };

  if (query.isLoading && !query.data) {
    return (
      <View style={tw`bg-[#FAFAFA] rounded-2xl pt-5 pb-10 px-2.5 mx-4`}>
        <View style={tw`flex-row justify-between items-center mb-5`}>
          <View style={tw`bg-gray-200 rounded w-[100px] h-5`} />
        </View>
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

  const spacing = (chartWidth - 70) / 11;

  return (
    <View
      style={[tw`bg-white rounded-2xl py-5 px-4 mx-4 overflow-hidden`, style]}
    >
      <View style={tw`flex-row justify-between items-center mb-5 z-20`}>
        <Text style={tw`text-lg text-black font-semibold`}>Sales Revenue</Text>
        <Dropdown
          style={tw`h-[35px] w-[90px] border border-[#E0E0E0] rounded-lg px-2`}
          containerStyle={tw`rounded-lg mt-1`}
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

      {isEmpty ? (
        <View style={tw`h-[200px] justify-center items-center`}>
          <Text style={tw`text-gray-400 text-sm`}>
            No sales data available for {selectedYear}.
          </Text>
        </View>
      ) : (
        <View style={tw`ml-[-10px] overflow-hidden`}>
          <LineChart
            data={formattedData}
            areaChart
            curved
            isAnimated
            animationDuration={1200}
            color={colors.black}
            startFillColor="#F3F4F6"
            endFillColor="#F3F4F6"
            startOpacity={0.9}
            endOpacity={0.1}
            dataPointsColor={colors.black}
            dataPointsRadius={4}
            initialSpacing={isTablet ? 35 : 20}
            endSpacing={isTablet ? 35 : 20}
            noOfSections={4}
            yAxisColor="transparent"
            yAxisThickness={0}
            rulesType="dashed"
            rulesColor="#F3F4F6"
            yAxisTextStyle={{
              color: "#9CA3AF",
              fontSize: 11,
              fontWeight: "500",
            }}
            formatYLabel={formatYAxisLabel}
            xAxisColor="transparent"
            yAxisOffset={0}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: "#E5E7EB",
              pointerStripWidth: 2,
              pointerColor: colors.black,
              radius: 6,
              pointerLabelWidth: 120,
              pointerLabelHeight: 120,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: renderTooltip,
            }}
            width={chartWidth}
            height={230}
            spacing={isTablet ? spacing : 50}
            thickness={2.5}
            hideRules={false}
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
}
