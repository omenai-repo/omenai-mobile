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
          tw`h-[50px] bg-white rounded-xl border border-gray-200 px-4`,
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
        renderItem={(item) => (
          <View style={tw`p-4 flex-row justify-between items-center`}>
            <Text style={tw`text-base text-gray-800`}>{item.label}</Text>
            {item.value === selectedYear && (
              <Text style={tw`text-blue-500 font-bold`}>✓</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default YearDropdown;
