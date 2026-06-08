import React from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type BinaryOption = {
  label: string;
  value: string;
};

type BinaryToggleProps = {
  readonly options?: [BinaryOption, BinaryOption];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabledValue?: string;
};

const defaultOptions: [BinaryOption, BinaryOption] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export default function BinaryToggle({
  options = defaultOptions,
  value,
  onChange,
  disabledValue,
}: BinaryToggleProps) {
  return (
    <View style={tw`flex-row gap-3`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabledValue === option.value;

        const buttonStyle = isDisabled
          ? tw`bg-gray-50 border-gray-100`
          : isSelected
            ? { backgroundColor: colors.black, borderColor: colors.black }
            : tw`bg-white border-gray-200`;

        const textStyle = isDisabled
          ? tw`text-gray-300`
          : isSelected
            ? { color: colors.white }
            : tw`text-gray-500`;

        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (isDisabled) return;
              onChange(option.value);
            }}
            disabled={isDisabled}
            style={[tw`flex-1 py-3 rounded-lg items-center justify-center border`, buttonStyle]}
          >
            <Text style={[tw`text-sm font-semibold`, textStyle]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
