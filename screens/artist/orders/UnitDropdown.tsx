import React from 'react';
import { Pressable, Text, View, FlatList } from 'react-native';
import tw from 'twrnc';

type UnitDropdownProps = {
  units: string[];
  selectedUnit: string;
  onSelect: (unit: string) => void;
  label?: string;
};

const UnitDropdown: React.FC<UnitDropdownProps> = ({ units, selectedUnit, onSelect }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <View style={tw`flex-1`}>
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        style={tw`px-3 h-[60px] border border-gray-300 mt-[25px] justify-center rounded-[90px] bg-white`}
      >
        <Text style={tw`text-[16px] text-center`}>{selectedUnit}</Text>
      </Pressable>

      {showDropdown && (
        <View style={tw`absolute w-full top-25 bg-white border border-gray-300 rounded z-50`}>
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
