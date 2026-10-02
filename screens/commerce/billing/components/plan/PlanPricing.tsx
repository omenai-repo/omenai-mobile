import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface PlanPricingProps {
  isEligibleForDiscount: boolean;
  prettyAmount: string;
  tab: "monthly" | "yearly";
  monthly_price: string | number;
  yearlySave: string | null;
  currencySymbol: string;
}

export const PlanPricing = ({
  isEligibleForDiscount,
  prettyAmount,
  tab,
  monthly_price,
  yearlySave,
  currencySymbol,
}: Readonly<PlanPricingProps>) => {
  const billingPeriod = tab === "monthly" ? "month" : "year";
  const startPrice = isEligibleForDiscount ? "$0" : prettyAmount;
  const durationText = isEligibleForDiscount
    ? "for 14 days"
    : `/${billingPeriod}`;

  return (
    <View>
      <View style={tw`mt-4 flex-row items-baseline`}>
        <Text style={tw`text-3xl font-bold text-slate-900`}>{startPrice}</Text>

        <Text style={tw`ml-2 text-base text-slate-500`}>{durationText}</Text>
      </View>

      {/* Discount badge or yearly savings */}
      {isEligibleForDiscount ? (
        <Text style={tw`mt-1 text-xs font-medium text-emerald-600`}>
          Then ${monthly_price}/mo · One-time offer
        </Text>
      ) : (
        Boolean(yearlySave) && (
          <Text style={tw`mt-1 text-xs text-green-600 font-medium`}>
            Save {currencySymbol}
            {yearlySave} per year
          </Text>
        )
      )}
    </View>
  );
};
