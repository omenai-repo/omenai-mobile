import React from "react";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export type CardHeaderStripeVariant =
  | "default"
  | "danger"
  | "success"
  | "warning";

type CardHeaderStripeProps = Readonly<{
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: CardHeaderStripeVariant;
  style?: StyleProp<ViewStyle>;
}>;

const VARIANT_CONFIG: Record<
  CardHeaderStripeVariant,
  { bg: string; iconColor: string; textColor: string }
> = {
  default: {
    bg: `bg-[${colors.black}]`,
    iconColor: "#94A3C4",
    textColor: "text-white",
  },
  danger: {
    bg: "bg-[#7F1D1D]",
    iconColor: "#FCA5A5",
    textColor: "text-white",
  },
  success: {
    bg: "bg-[#065F46]",
    iconColor: "#A7F3D0",
    textColor: "text-white",
  },
  warning: {
    bg: "bg-[#92400E]",
    iconColor: "#FDE68A",
    textColor: "text-white",
  },
};

export default function CardHeaderStripe({
  title,
  icon,
  variant = "default",
  style,
}: CardHeaderStripeProps) {
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.default;

  return (
    <View
      style={[
        tw`${config.bg} rounded-t-sm px-5 py-3.5 flex-row items-center gap-2.5`,
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={14} color={config.iconColor} />
      ) : null}
      <Text
        style={tw`font-sans-regular text-base ${config.textColor} tracking-wide`}
      >
        {title}
      </Text>
    </View>
  );
}
