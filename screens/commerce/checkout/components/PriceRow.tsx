import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";

export const PriceRow = ({
  label,
  value,
  currency,
  minus = false,
}: {
  label: string;
  value: number;
  currency: string | undefined;
  minus?: boolean;
}) => (
  <View style={tw`flex-row items-center justify-between`}>
    <Text style={tw`text-[12px] font-semibold text-slate-600`}>{label}</Text>
    <Text style={tw`text-[12px] font-semibold text-slate-900`}>
      {minus
        ? `-${utils_formatPrice(value, currency)}`
        : utils_formatPrice(value, currency)}
    </Text>
  </View>
);
