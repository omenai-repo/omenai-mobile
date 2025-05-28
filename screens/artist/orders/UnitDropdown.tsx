import React from 'react';
import { Pressable, Text, View, FlatList } from 'react-native';
import tw from 'twrnc';

type UnitDropdownProps<T extends string> = {
  units: T[];
  selectedUnit: T;
  onSelect: (unit: T) => void;
  label?: string;
};

const UnitDropdown = <T extends string>({
  units,
  selectedUnit,
  onSelect,
}: UnitDropdownProps<T>) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        style={tw`px-3 h-[50px] border border-gray-300 justify-center rounded-[90px] bg-white`}
      >
        <Text style={tw`text-[16px] text-center`}>{selectedUnit}</Text>
      </Pressable>

      {showDropdown && (
        <View style={tw`absolute w-full top-[60px] bg-white border border-gray-300 rounded z-200`}>
          {units.map((item, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  onSelect(item);
                  setShowDropdown(false);
                }}
                style={tw`px-3 py-2`}
              >
                <Text style={tw`text-[16px] text-center`}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default UnitDropdown;
