import React from "react";
import { Pressable, Text, View, ScrollView } from "react-native";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";

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
  const [showDropdown, setShowDropdown] = React.useState(false);

  const selectedLabel = units.find((u) => u.value === selectedUnit)?.label || selectedUnit;

  return (
    <View style={tw`relative`}>
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        style={tw`px-3 h-[50px] border border-gray-300 flex-row items-center justify-between rounded-lg bg-white`}
        accessibilityRole="button"
      >
        <Text style={tw`text-[16px] text-left`}>{selectedLabel}</Text>
        <Feather name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#616161" />
      </Pressable>

      {showDropdown && (
        <View
          style={tw`absolute left-0 right-0 top-[58px] z-20 bg-white border border-gray-300 rounded-lg shadow-lg`}
        >
          <ScrollView style={tw`max-h-[200px]`} nestedScrollEnabled>
            {units.map((item, index) => (
              <Pressable
                key={item.value + index}
                onPress={() => {
                  onSelect(item.value);
                  setShowDropdown(false);
                }}
                style={tw`${index > 0 ? "border-t border-gray-200" : ""} px-3 py-3`}
              >
                <Text style={tw`text-[16px] text-left`}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default UnitDropdown;
