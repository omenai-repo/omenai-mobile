import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { formatISODate } from "#utils/utils_formatISODate";

interface WalletTransactionItemProps {
  status: "FAILED" | "PENDING" | "SUCCESSFUL";
  dateTime: string;
  amount: number;
  onPress: () => void;
  isLast?: boolean;
}

export const WalletTransactionItem = ({
  status,
  dateTime,
  amount,
  onPress,
  isLast,
}: WalletTransactionItemProps) => {
  const statusConfig = {
    FAILED: {
      color: "#991b1b",
      bgColor: "#fee2e2",
      icon: "close-circle-outline" as const,
      label: "Withdrawal failed",
    },
    PENDING: {
      color: "#92400e",
      bgColor: "#fef3c7",
      icon: "time-outline" as const,
      label: "Withdrawal processing",
    },
    SUCCESSFUL: {
      color: "#065f46",
      bgColor: "#d1fae5",
      icon: "checkmark-circle-outline" as const,
      label: "Withdrawal successful",
    },
  };

  const config = statusConfig[status] ?? statusConfig.SUCCESSFUL;

  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-row items-center px-4 py-3.5`,
        !isLast && tw`border-b border-neutral-100`,
      ]}
    >
      {/* Status icon circle */}
      <View
        style={[
          tw`w-8 h-8 rounded-full items-center justify-center mr-3`,
          { backgroundColor: config.bgColor },
        ]}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      {/* Label + date */}
      <View style={tw`flex-1`}>
        <Text style={tw`text-sm font-medium text-slate-800`}>
          {config.label}
        </Text>
        <Text style={tw`text-xs text-neutral-500 mt-[1px]`}>
          {formatISODate(dateTime)}
        </Text>
      </View>

      {/* Amount + status text badge */}
      <View style={tw`items-end`}>
        <Text style={tw`text-sm font-semibold text-slate-800`}>
          {utils_formatPrice(amount)}
        </Text>
        <View
          style={[
            tw`mt-1 rounded-md px-1.5 py-[1px]`,
            { backgroundColor: config.bgColor },
          ]}
        >
          <Text
            style={[
              tw`text-xs font-semibold uppercase`,
              { color: config.color },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
