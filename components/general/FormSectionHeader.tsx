import React from "react";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export function SectionIndicator({
  color,
  style,
}: {
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        tw`w-0.5 h-5 rounded-full`,
        { backgroundColor: color ?? colors.black },
        style,
      ]}
    />
  );
}

type FormSectionHeaderProps = {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  indicatorColor?: string;
};

export default function FormSectionHeader({
  title,
  subtitle,
  style,
  indicatorColor,
}: FormSectionHeaderProps) {
  return (
    <View style={[tw`flex-row items-center gap-3`, style]}>
      <SectionIndicator color={indicatorColor} />
      <View style={tw`flex-1`}>
        <Text
          style={[tw`font-sans-regular text-base`, { color: colors.black }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={tw`font-sans-regular text-xs text-neutral-500 mt-0.5`}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
