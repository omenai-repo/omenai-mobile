import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import tw from "twrnc";

interface AddressTooltipProps {
  showToolTip: boolean;
  setShowToolTip: (value: boolean) => void;
  tooltipText: string;
}

export const AddressTooltip = ({
  showToolTip,
  setShowToolTip,
  tooltipText,
}: AddressTooltipProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={tw`mt-5 mb-3 mr-3`}>
      <Pressable
        onPress={() => setShowToolTip(!showToolTip)}
        style={tw`rounded-full h-11 w-11 justify-center items-center bg-black self-end`}
      >
        <Text style={tw`text-white text-xl`}>?</Text>
      </Pressable>
      {showToolTip && (
        <View style={[tw`absolute top-0 right-16`, { width: width / 2 }]}>
          <View style={tw`rounded-[12px] bg-[#111111] py-2.5 px-4`}>
            <Text style={tw`text-[10px] text-white text-center leading-[15px]`}>{tooltipText}</Text>
          </View>
          <View
            style={tw`w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[20px] rounded-[5px] border-l-[#111111] absolute right-[-17px] top-[15px]`}
          />
        </View>
      )}
    </View>
  );
};
