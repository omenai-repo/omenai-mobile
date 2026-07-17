import { KeyboardTypeOptions, StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";

type InputProps = {
  label: string;
  value: string;
  onInputChange: (e: string) => void;
  placeHolder?: string;
  keyboardType?: KeyboardTypeOptions;
  errorMessage?: string;
  handleBlur?: () => void;
  disabled?: boolean;
  defaultValue?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Input({
  label,
  onInputChange,
  placeHolder,
  keyboardType,
  value,
  errorMessage,
  handleBlur,
  disabled,
  defaultValue,
  containerStyle,
}: InputProps) {
  return (
    <View style={[containerStyle]}>
      <Text style={[tw`text-sm`, { color: colors.grey }]}>{label}</Text>
      <TextInput
        onChangeText={onInputChange}
        placeholder={placeHolder}
        placeholderTextColor={colors.grey}
        style={[
          tw`h-11 w-full border px-3 rounded-lg mt-2.5`,
          {
            borderColor: colors.inputBorder,
            backgroundColor: "#FAFAFA",
            color: colors.primary_black,
          },
          disabled && { color: `${colors.primary_black}70` },
        ]}
        keyboardType={keyboardType}
        autoCapitalize="none"
        value={defaultValue ? undefined : value}
        defaultValue={defaultValue}
        onBlur={handleBlur}
        editable={!disabled}
      />
      {errorMessage && errorMessage?.length > 0 && (
        <Text style={tw`text-red-500 mt-0.5`}>{errorMessage || ""}</Text>
      )}
    </View>
  );
}
