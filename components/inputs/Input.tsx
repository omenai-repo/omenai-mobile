import {
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextInputProps,
} from "react-native";
import React, { forwardRef } from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";

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
  inputStyle?: StyleProp<ViewStyle>;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  textContentType?: TextInputProps["textContentType"];
  autoComplete?: TextInputProps["autoComplete"];
  autoCorrect?: TextInputProps["autoCorrect"];
};

const Input = forwardRef<TextInput, InputProps & { testID?: string }>(
  function Input(props, ref) {
    const {
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
      inputStyle,
      testID,
      returnKeyType,
      onSubmitEditing,
      textContentType,
      autoComplete,
      autoCorrect,
    } = props;

    return (
      <View style={[containerStyle]}>
        {!!label && (
          <Text style={[tw`text-sm font-sans-regular`, { color: colors.grey }]}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          testID={testID}
          onChangeText={onInputChange}
          placeholder={placeHolder}
          placeholderTextColor={colors.grey}
          style={[
            tw`py-3 w-full border px-3 rounded-sm font-sans-regular`,
            !!label && tw`mt-2.5`,
            {
              borderColor: colors.inputBorder,
              backgroundColor: "#FAFAFA",
              color: colors.primary_black,
            },
            disabled && { color: `${colors.primary_black}70` },
            inputStyle,
          ]}
          keyboardType={keyboardType}
          autoCapitalize="none"
          value={defaultValue ? undefined : value}
          defaultValue={defaultValue}
          onBlur={handleBlur}
          editable={!disabled}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          submitBehavior="blurAndSubmit"
          textContentType={textContentType}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect ?? false}
        />
        {!!errorMessage && (
          <Text style={tw`text-red-500 mt-0.5 font-sans-regular text-sm`}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  },
);

export default Input;
