import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import tw from "twrnc";
import { colors } from "../../config/colors.config";
import type { TextInputProps } from "react-native";

type PasswordInputProps = {
  label: string;
  onInputChange: (e: string) => void;
  placeHolder: string;
  value: string;
  errorMessage?: string;
  handleBlur?: () => void;
  textContentType?: "newPassword" | "password" | "none";
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  blurOnSubmit?: TextInputProps["blurOnSubmit"];
  autoComplete?: TextInputProps["autoComplete"];
};

const PasswordInput = forwardRef<
  TextInput,
  PasswordInputProps & { testID?: string }
>(function PasswordInput(props, ref) {
  const {
    label,
    onInputChange,
    placeHolder,
    value,
    errorMessage,
    handleBlur,
    textContentType = "password",
    testID,
    returnKeyType,
    onSubmitEditing,
    blurOnSubmit,
    autoComplete,
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text
        style={[tw`text-sm font-sans-regular`, { color: colors.inputLabel }]}
      >
        {label}
      </Text>
      <View
        style={[
          tw`w-full border bg-[#FAFAFA] overflow-hidden rounded-sm mt-2.5 flex-row`,
          { borderColor: colors.inputBorder },
        ]}
      >
        <TextInput
          ref={ref}
          testID={testID}
          style={[
            tw`flex-1 py-3 px-3 bg-transparent font-sans-regular text-sm`,
            { color: colors.black },
          ]}
          placeholder={placeHolder}
          placeholderTextColor={colors.inputLabel}
          onChangeText={onInputChange}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={value}
          onBlur={handleBlur}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          autoComplete={autoComplete}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={tw`w-[50px] justify-center items-center`}
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={16}
            color={colors.inputLabel}
          />
        </TouchableOpacity>
      </View>
      {errorMessage && errorMessage?.length > 0 && (
        <Text style={tw`text-red-500 mt-0.5`}>{errorMessage || ""}</Text>
      )}
    </View>
  );
});

export default PasswordInput;
