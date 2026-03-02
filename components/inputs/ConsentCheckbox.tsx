import React from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type ConsentCheckboxProps = {
  readonly checked: boolean;
  readonly onToggle: () => void;
  readonly children: React.ReactNode;
  readonly isLast?: boolean;
};

export default function ConsentCheckbox({
  checked,
  onToggle,
  children,
  isLast = false,
}: ConsentCheckboxProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={tw`flex-row items-start gap-3 ${isLast ? "" : "mb-3"}`}
    >
      <View
        style={[
          tw`w-4 h-4 rounded border border-amber-200 items-center justify-center mt-0.5`,
          checked
            ? { backgroundColor: colors.black }
            : { backgroundColor: colors.white },
        ]}
      >
        {checked ? <Text style={tw`text-white text-xs`}>✓</Text> : null}
      </View>
      <Text style={tw`text-slate-600 text-xs flex-1 leading-relaxed`}>
        {children}
      </Text>
    </Pressable>
  );
}
