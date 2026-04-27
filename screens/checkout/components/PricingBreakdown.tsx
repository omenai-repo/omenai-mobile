import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { PriceRow } from "./PriceRow";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

export const PricingBreakdown = ({
  isInitialSubscription,
  days_left,
  upgradeCost,
  proratedPrice,
  grandTotal,
  currency,
  showCharge,
  discountEligible,
  discountAmount,
}: any) => (
  <View style={tw`bg-white rounded-md border border-slate-100 p-5 mb-5`}>
    {!isInitialSubscription && (
      <View
        style={tw`flex-row items-center justify-between pb-3 border-b border-slate-100`}
      >
        <Text style={tw`text-[13px] font-medium text-slate-600`}>
          Current plan usage
        </Text>
        <Text style={tw`text-[13px] font-semibold text-slate-900`}>
          {days_left} day(s) left
        </Text>
      </View>
    )}
    <View style={tw`mt-3`}>
      <View style={tw`gap-2`}>
        <PriceRow
          label="Plan cost"
          value={discountEligible ? discountAmount : upgradeCost}
          currency={currency}
        />
        {discountEligible && (
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={tw`text-[12px] font-semibold text-emerald-600`}>
                Welcome Discount
              </Text>
              <View style={tw`px-1.5 py-0.5 bg-emerald-100 rounded-md`}>
                <Text
                  style={tw`text-[9px] font-bold text-emerald-700 uppercase`}
                >
                  14 DAYS FREE
                </Text>
              </View>
            </View>
            <Text style={tw`text-[12px] font-semibold text-emerald-600`}>
              -{utils_formatPrice(discountAmount, currency)}
            </Text>
          </View>
        )}
        {!isInitialSubscription && !discountEligible && (
          <PriceRow
            label="Prorated cost"
            value={showCharge ? proratedPrice : 0}
            currency={currency}
            minus={showCharge}
          />
        )}
      </View>
      <View style={tw`mt-3 pt-3 border-t border-slate-100`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-[14px] font-semibold text-slate-900`}>
            Due today
          </Text>
          <Text style={tw`text-[16px] font-bold text-slate-900`}>
            {utils_formatPrice(grandTotal, currency)}
          </Text>
        </View>
      </View>
      {discountEligible && (
        <View
          style={tw`mt-4 p-3 rounded-md bg-emerald-50 border border-emerald-200`}
        >
          <Text style={tw`text-[12px] text-emerald-800`}>
            <Text style={tw`font-semibold`}>Note:</Text> You won&apos;t be charged
            today. We&apos;ll save your card for future billing.
          </Text>
        </View>
      )}
      {!showCharge && !isInitialSubscription && !discountEligible && (
        <View
          style={tw`mt-4 p-3 rounded-md bg-amber-50 border border-amber-200`}
        >
          <Text style={tw`text-[12px] text-amber-800`}>
            <Text style={tw`font-semibold`}>Note:</Text> Your plan change will
            take effect at the end of your current billing cycle.
          </Text>
        </View>
      )}
    </View>
  </View>
);
