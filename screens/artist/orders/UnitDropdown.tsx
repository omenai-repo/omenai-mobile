import React from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "twrnc";

type UnitItem = {
  label: string;
  value: string;
};

type UnitDropdownProps = {
  units: UnitItem[];
  selectedUnit: string;
  onSelect: (unit: string) => void;
};

const UnitDropdown = ({ units, selectedUnit, onSelect }: UnitDropdownProps) => {
  return (
    <View style={tw`relative w-full`}>
      <Dropdown
        style={tw`h-[50px] bg-white rounded-lg border border-gray-300 px-3`}
        placeholderStyle={tw`text-base text-gray-800`}
        selectedTextStyle={tw`text-base text-gray-800`}
        inputSearchStyle={tw`h-10 text-base`}
        iconStyle={tw`w-5 h-5`}
        data={units}
        search={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Unit"
        value={selectedUnit}
        onChange={(item) => {
          onSelect(item.value);
        }}
        renderItem={(item) => {
          const isSelected = item.value === selectedUnit;
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

export default UnitDropdown;
