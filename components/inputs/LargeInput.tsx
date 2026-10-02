import {
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type InputProps = {
  label: string;
  value: string;
  onInputChange: (e: string) => void;
  placeHolder?: string;
  errorMessage?: string;
  handleBlur?: () => void;
  defaultValue?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  height?: number;
};

export default function LargeInput({
  label,
  onInputChange,
  placeHolder,
  value,
  errorMessage,
  handleBlur,
  defaultValue,
  containerStyle,
  inputStyle,
  height,
}: InputProps) {
  return (
    <View style={[tw`flex-1`, containerStyle] as any}>
      <Text style={[tw`text-sm font-sans-regular`, { color: colors.inputLabel }]}>{label}</Text>

      <TextInput
        onChangeText={onInputChange}
        placeholder={placeHolder}
        placeholderTextColor={colors.inputLabel}
        style={[
          tw`w-full rounded-sm mt-2 text-sm font-sans-regular`,
          inputStyle,
          height ? { height } : { height: 140 },
          {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            backgroundColor: colors.inputBackground,
            paddingHorizontal: 20,
            paddingTop: 15,
            textAlignVertical: "top",
            color: colors.primary_black,
          },
        ]}
        keyboardType="default"
        autoCapitalize="none"
        value={defaultValue ? undefined : value}
        onBlur={handleBlur}
        multiline
        numberOfLines={4}
        defaultValue={defaultValue}
      />

      {errorMessage && errorMessage?.length > 0 && (
        <Text style={tw`mt-1 font-sans-regular text-sm text-red-500`}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
