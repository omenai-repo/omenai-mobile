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
    <View style={[tw`w-full`, style]}>
      <Dropdown
        style={[
          tw`h-[50px] bg-white rounded-md border border-gray-200 px-4`,
          style,
        ]}
        placeholderStyle={tw`text-base text-gray-800 font-semibold`}
        selectedTextStyle={tw`text-base text-gray-800 font-semibold`}
        inputSearchStyle={tw`h-10 text-base`}
        iconStyle={tw`w-5 h-5`}
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
                tw`p-4 flex-row justify-between items-center`,
                isSelected ? tw`bg-slate-100` : null,
              ]}
            >
              <Text
                style={[
                  tw`text-base`,
                  isSelected
                    ? tw`text-neutral-900 font-bold`
                    : tw`text-gray-800`,
                ]}
              >
                {item.label}
              </Text>
              {isSelected && (
                <Text style={tw`text-neutral-900 font-bold`}>✓</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default YearDropdown;
