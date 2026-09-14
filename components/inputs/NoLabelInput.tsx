import { KeyboardTypeOptions, TextInput, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import tw from "twrnc";

type NoLabelInputProps = {
  value: string;
  onInputChange: (e: string) => void;
  placeHolder: string;
  keyboardType?: KeyboardTypeOptions;
  errorMessage?: string;
  handleBlur?: () => void;
};

export default function NoLabelInput({
  value,
  onInputChange,
  placeHolder,
  keyboardType,
  errorMessage,
  handleBlur,
}: NoLabelInputProps) {
  return (
    <View style={tw`flex-1 w-full`}>
      <TextInput
        onChangeText={onInputChange}
        placeholder={placeHolder}
        placeholderTextColor={colors.grey}
        style={[
          tw`h-[46px] w-full border rounded-sm mt-2.5 px-4 font-sans-regular`,
          {
            borderColor:
              errorMessage && errorMessage.length > 0
                ? "#EF4444"
                : colors.inputBorder,
            backgroundColor: colors.inputBackground,
            color: colors.primary_black,
          },
        ]}
        keyboardType={keyboardType}
        autoCapitalize="none"
        value={value}
        onBlur={handleBlur}
        autoCorrect={false}
      />
    </View>
  );
}
