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
};

export default function PasswordInput({
  label,
  onInputChange,
  placeHolder,
  value,
  errorMessage,
  handleBlur,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text style={[tw`text-sm`, { color: colors.inputLabel }]}>{label}</Text>
      <View
        style={[
          tw`h-[46px] w-full border bg-[#FAFAFA] overflow-hidden rounded-lg mt-2.5 flex-row items-center`,
          { borderColor: colors.inputBorder },
        ]}
      >
        <TextInput
          style={[
            tw`flex-1 h-full px-3 bg-transparent`,
            { color: colors.black },
          ]}
          placeholder={placeHolder}
          placeholderTextColor={colors.inputLabel}
          onChangeText={onInputChange}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={value}
          onBlur={handleBlur}
        />
        <TouchableOpacity
          style={tw`w-[50px] h-full items-center justify-center`}
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
