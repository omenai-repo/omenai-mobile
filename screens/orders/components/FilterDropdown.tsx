import React from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "twrnc";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterDropdownProps {
  data: FilterOption[];
  selectedValue: string | number;
  onSelect: (value: any) => void;
  style?: any;
  placeholder?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  data,
  selectedValue,
  onSelect,
  style,
  placeholder = "Select",
}) => {
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
      data={data}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={selectedValue}
      onChange={(item) => {
        onSelect(item.value);
      }}
      renderItem={(item) => {
        const isSelected = item.value === selectedValue;
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

export default FilterDropdown;
