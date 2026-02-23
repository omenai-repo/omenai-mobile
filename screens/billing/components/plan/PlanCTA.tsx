import React from "react";
import { Text, Pressable } from "react-native";
import tw from "twrnc";

interface PlanCTAProps {
  isDisabled: boolean;
  handleNavigate: () => void;
  name: string;
  finalButtonText: string;
}

export const PlanCTA = ({
  isDisabled,
  handleNavigate,
  name,
  finalButtonText,
}: Readonly<PlanCTAProps>) => {
  return (
    <Pressable
      disabled={isDisabled}
      onPress={handleNavigate}
      style={({ pressed }) => {
        let opacityStyle = "";
        if (isDisabled) {
          opacityStyle = "opacity-50";
        } else if (pressed) {
          opacityStyle = "opacity-90";
        }

        return tw.style(
          `mt-5 h-12 rounded-md items-center justify-center`,
          name === "Pro"
            ? "bg-slate-900"
            : "bg-slate-100 border border-slate-200",
          opacityStyle,
        );
      }}
      accessibilityRole="button"
      accessibilityLabel={finalButtonText}
    >
      <Text
        style={tw`${
          name === "Pro" ? "text-white" : "text-slate-900"
        } text-sm font-medium`}
      >
        {finalButtonText}
      </Text>
    </Pressable>
  );
};
