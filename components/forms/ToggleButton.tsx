import React from 'react';
import { Pressable, Text } from 'react-native';
import tw from 'twrnc';

interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ 
  label, 
  isSelected, 
  onPress 
}) => (
  <Pressable
    onPress={onPress}
    style={tw.style(
      'h-[51px] rounded-full justify-center items-center flex-1 border-2',
      isSelected ? 'bg-black border-black' : 'bg-[#F7F7F7] border-[#000000]',
    )}
  >
    <Text
      style={tw.style(
        'font-bold text-[14px]',
        isSelected ? 'text-white' : 'text-[#1A1A1A]',
      )}
    >
      {label}
    </Text>
  </Pressable>
);

export default ToggleButton;
