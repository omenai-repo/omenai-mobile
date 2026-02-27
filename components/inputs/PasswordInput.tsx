import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import tw from "twrnc";
import { colors } from "../../config/colors.config";

type PasswordInputProps = {
  label: string;
  onInputChange: (e: string) => void;
  placeHolder: string;
  value: string;
  errorMessage?: string;
  handleBlur?: () => void;
  textContentType?: "newPassword" | "password" | "none";
};

export default function PasswordInput({
  label,
  onInputChange,
  placeHolder,
  value,
  errorMessage,
  handleBlur,
  textContentType,
  testID,
}: PasswordInputProps & { testID?: string }) {
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
          tw`w-full border bg-[#FAFAFA] overflow-hidden rounded-md mt-2.5 flex-row`,
          { borderColor: colors.inputBorder },
        ]}
      >
        <TextInput
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
        />
        <TouchableOpacity
          style={tw`w-[50px] justify-center items-center`}
          onPress={() => setShowPassword((prev) => !prev)}
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
}
