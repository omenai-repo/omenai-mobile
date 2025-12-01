import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";

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
        style={[
          tw`rounded-full h-11 w-11 justify-center items-center self-end`,
          { backgroundColor: colors.black },
        ]}
      >
        <Text style={[tw`text-xl`, { color: colors.white }]}>{"?"}</Text>
      </Pressable>
      {showToolTip && (
        <View style={[tw`absolute top-0 right-16`, { width: width / 2 }]}>
          <View style={[tw`rounded-[12px] py-2.5 px-4`, { backgroundColor: `${colors.black}` }]}>
            <Text style={[tw`text-[10px] text-center leading-[15px]`, { color: colors.white }]}>
              {tooltipText}
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: 10,
              borderTopColor: "transparent",
              borderBottomWidth: 10,
              borderBottomColor: "transparent",
              borderLeftWidth: 20,
              borderLeftColor: `${colors.black}`,
              position: "absolute",
              right: -17,
              top: 15,
            }}
          />
        </View>
      )}
    </View>
  );
};
