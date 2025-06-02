import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

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
    <View>
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        style={tw`px-3 h-[50px] border border-gray-300 justify-center rounded-[90px] bg-white`}
      >
        <Text style={tw`text-[16px] text-center`}>{selectedLabel}</Text>
      </Pressable>

      {showDropdown && (
        <View style={tw`absolute w-full top-[60px] bg-white border border-gray-300 rounded z-200`}>
          {units.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onSelect(item.value);
                setShowDropdown(false);
              }}
              style={tw`px-3 py-2`}
            >
              <Text style={tw`text-[16px] text-center`}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default UnitDropdown;
