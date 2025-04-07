import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SvgXml } from 'react-native-svg';
import { dropdownIcon, dropUpIcon } from 'utils/SvgImages';
import tw from 'twrnc';

const OrderYearDropdown = ({
  selectedYear,
  setSelectedYear,
}: {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const launchYear = 2025;

  // Only generate years from launchYear up to currentYear (descending)
  const years = Array.from({ length: currentYear - launchYear + 1 }, (_, i) => currentYear - i);

  return (
    <View style={tw`mb-[20px] relative`}>
      <TouchableOpacity
        style={tw`flex-row items-center gap-[10px] bg-white border border-[#E7E7E7] rounded-[12px] px-[16px] py-[10px]`}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={tw`text-[14px] text-[#1A1A1A] font-medium`}>{selectedYear}</Text>
        <SvgXml xml={isOpen ? dropUpIcon : dropdownIcon} />
      </TouchableOpacity>

      {isOpen && (
        <View
          style={tw`absolute top-[50px] left-0 right-0 bg-white rounded-[12px] border border-[#E7E7E7] z-10`}
        >
          <FlatList
            data={years}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`px-[16px] py-[10px]`}
                onPress={() => {
                  setSelectedYear(item);
                  setIsOpen(false);
                }}
              >
                <Text style={tw`text-[14px] text-[#1A1A1A]`}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default OrderYearDropdown;
