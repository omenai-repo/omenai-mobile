import React from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type PillProps = {
  label: string;
  value: string;
  onTap: (e: string) => void;
  selected: boolean;
};

export const Pill = ({ label, value, onTap, selected }: PillProps) => {
  return (
    <Pressable onPress={() => onTap(value)}>
      <View
        style={[
          tw`px-[15px] py-[10px] rounded-sm bg-[#f1f1f1]`,
          selected && { backgroundColor: colors.primary_black },
        ]}
      >
        <Text
          style={[
            tw`text-[12px] opacity-80 text-black`,
            selected && tw`text-white opacity-100`,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};
