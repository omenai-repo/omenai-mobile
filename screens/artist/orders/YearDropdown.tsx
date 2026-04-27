import React from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "twrnc";

const YearDropdown = ({
  selectedYear,
  setSelectedYear,
  style,
}: {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  style?: any;
}) => {
  const currentYear = new Date().getFullYear();
  const launchYear = 2025;

  const years = Array.from({ length: currentYear - launchYear + 1 }, (_, i) => {
    const year = currentYear - i;
    return { label: year.toString(), value: year };
  });

  return (
    <Dropdown
      style={[
        tw`h-[42px] bg-white rounded-sm border border-gray-200 px-3`,
        style,
      ]}
      placeholderStyle={tw`text-[13px] text-gray-800 font-sans-medium`}
      selectedTextStyle={tw`text-[13px] text-gray-800 font-sans-medium`}
      inputSearchStyle={tw`h-8 text-[13px] font-sans-regular`}
      iconStyle={tw`w-4 h-4`}
      data={years}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select year"
      value={selectedYear}
      onChange={(item) => {
        setSelectedYear(item.value);
      }}
      renderItem={(item) => {
        const isSelected = item.value === selectedYear;
        return (
          <View
            style={[
              tw`p-3 flex-row justify-between items-center`,
              isSelected ? tw`bg-slate-100` : null,
            ]}
          >
            <Text
              style={[
                tw`text-sm`,
                isSelected
                  ? tw`text-neutral-900 font-sans-medium`
                  : tw`text-gray-800 font-sans-regular`,
              ]}
            >
              {item.label}
            </Text>
            {isSelected && (
              <Text style={tw`text-neutral-900 font-sans-medium`}>✓</Text>
            )}
          </View>
        );
      }}
    />
  );
};

export default YearDropdown;
