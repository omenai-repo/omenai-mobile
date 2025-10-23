import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import UnitDropdown from 'screens/artist/orders/UnitDropdown';

interface UnitDropdownFieldProps {
  label: string;
  units: Array<{ label: string; value: string }>;
  selectedUnit: string;
  onSelect: (unit: string) => void;
}

const UnitDropdownField: React.FC<UnitDropdownFieldProps> = ({
  label,
  units,
  selectedUnit,
  onSelect
}) => (
  <View style={tw`flex-1`}>
    <Text style={tw`text-[14px] text-[#858585] mb-[10px]`}>{label}</Text>
    <UnitDropdown
      units={units}
      selectedUnit={selectedUnit}
      onSelect={onSelect}
    />
  </View>
);

export default UnitDropdownField;
