import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { formatISODate } from "#utils/utils_formatISODate";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { currency_symbol } from "#json/currencySymbol";

export type Txn = {
  trans_id: string;
  status: string;
  date: string; // ISO
  amount: number;
  currency?: string;
};

function getStatusConfig(status: string) {
  switch (status) {
    case "successful":
      return {
        text: "Payment processed successfully",
        color: tw`text-green-600`,
      };
    case "failed":
      return {
        text: "Payment failed",
        color: tw`text-red-600`,
      };
    case "pending":
    default:
      return {
        text: "Payment pending",
        color: tw`text-amber-600`,
      };
  }
}

export function SubscriptionTransactionRow({
  item,
  index,
}: {
  item: Txn;
  index: number;
}) {
  const { text: statusText, color: statusColor } = getStatusConfig(item.status);

  const currencyCode = item.currency ?? "USD";
  const symbolItem = currency_symbol.find(
    (c) => c.abbreviation.toLowerCase() === currencyCode.toLowerCase(),
  );
  const symbol = symbolItem ? symbolItem.symbol : "$";
  const amountLabel = utils_formatPrice(item.amount, symbol);

  return (
    <View
      style={tw`bg-white rounded-md p-4 border border-gray-200 flex-row items-start justify-between`}
    >
      <View style={tw`flex-shrink mr-2`}>
        <Text style={tw`text-xs font-semibold text-gray-500 mb-1`}>
          #{item.trans_id}
        </Text>
        <Text style={[tw`text-xs font-medium mb-1`, statusColor]}>
          {statusText}
        </Text>
        <Text style={tw`text-xs text-gray-500`}>
          {formatISODate(item.date)}
        </Text>
      </View>
      <Text style={tw`text-sm font-bold text-gray-900`}>{amountLabel}</Text>
    </View>
  );
}
