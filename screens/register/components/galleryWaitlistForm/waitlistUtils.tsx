import { Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";

// Shared validation functions
export const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Please enter a valid email address";
  return undefined;
};

export const validateGalleryName = (value: string): string | undefined => {
  if (!value.trim()) return "Gallery name is required";
  if (value.trim().length < 2)
    return "Gallery name must be at least 2 characters";
  return undefined;
};

export const validateInviteCode = (value: string): string | undefined => {
  if (!value || value.trim() === "") return "Code is required";
  if (value.trim().length < 2) return "Code must be at least 2 characters long";
  if (value.trim().length > 100) return "Code must not exceed 100 characters";
  return undefined;
};

// Shared underlined link component
type UnderlinedLinkProps = Readonly<{
  text: string;
  onPress: () => void;
}>;

export function UnderlinedLink({ text, onPress }: UnderlinedLinkProps) {
  return (
    <TouchableOpacity onPress={onPress} style={tw`mt-4 self-end`}>
      <Text
        style={[
          tw`text-sm pb-px border-b`,
          { color: colors.black, borderColor: colors.black },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
