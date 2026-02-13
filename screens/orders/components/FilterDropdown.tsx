import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import { dropdownIcon, dropUpIcon } from "#utils/SvgImages";

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
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    data.find((item) => item.value === selectedValue)?.label || placeholder;

  return (
    <View style={[tw`relative z-20`, { elevation: 20 }, style]}>
      <TouchableOpacity
        style={tw`flex-row items-center justify-between gap-[10px] bg-white border border-[#E7E7E7] rounded-[12px] px-[16px] py-[10px]`}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={tw`text-[14px] text-[#1A1A1A] font-medium`}>
          {selectedLabel}
        </Text>
        <SvgXml xml={isOpen ? dropUpIcon : dropdownIcon} />
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            tw`absolute top-[50px] left-0 right-0 bg-white rounded-[12px] border border-[#E7E7E7] z-30 shadow-sm`,
            { elevation: 30 },
          ]}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`px-[16px] py-[10px] border-b border-gray-50 last:border-0`}
                onPress={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={tw`text-[14px] ${
                    selectedValue === item.value
                      ? "text-black font-semibold"
                      : "text-[#666]"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 200 }}
            nestedScrollEnabled={true}
          />
        </View>
      )}
    </View>
  );
};

export default FilterDropdown;
