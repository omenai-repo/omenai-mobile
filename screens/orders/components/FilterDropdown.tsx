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
    <View style={[tw`w-full h-[50px]`, style]}>
      <Dropdown
        style={[
          tw`h-[50px] bg-white rounded-xl border border-gray-200 px-4`,
          style,
        ]}
        placeholderStyle={tw`text-base text-gray-800 font-medium`}
        selectedTextStyle={tw`text-base text-gray-800 font-medium`}
        inputSearchStyle={tw`h-10 text-base`}
        iconStyle={tw`w-5 h-5`}
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
                tw`p-4 flex-row justify-between items-center`,
                isSelected ? tw`bg-blue-50` : null,
              ]}
            >
              <Text
                style={[
                  tw`text-base`,
                  isSelected ? tw`text-blue-600 font-bold` : tw`text-gray-800`,
                ]}
              >
                {item.label}
              </Text>
              {isSelected && <Text style={tw`text-blue-500 font-bold`}>✓</Text>}
            </View>
          );
        }}
      />
    </View>
  );
};

export default FilterDropdown;
