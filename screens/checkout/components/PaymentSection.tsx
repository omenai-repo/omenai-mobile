import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { InitialPaymentForm } from "./InitialPaymentForm";
import { BillingCard } from "#screens/subscriptions/components/BillingCard";

export const PaymentSection = ({
  isInitialSubscription,
  plan,
  interval,
  sub_data,
  discountEligible,
}: any) => (
  <View style={tw`rounded-2xl border border-slate-200 bg-slate-50 p-5`}>
    <View style={tw`flex-row items-center justify-between mb-4`}>
      <Text style={tw`text-[14px] font-semibold text-slate-900`}>
        Payment Details
      </Text>
      <View style={tw`px-2 py-1 rounded-full bg-green-100`}>
        <Text style={tw`text-[10px] font-medium text-green-700`}>
          Encrypted
        </Text>
      </View>
    </View>
    {isInitialSubscription ? (
      <InitialPaymentForm
        planId={plan.plan_id}
        amount={(() => {
          if (discountEligible) return 0;
          return interval === "monthly"
            ? +plan.pricing.monthly_price
            : +plan.pricing.annual_price;
        })()}
        interval={interval}
        discountEligible={discountEligible}
      />
    ) : (
      sub_data && (
        <BillingCard
          paymentMethod={sub_data.paymentMethod}
          plan_id={plan.plan_id}
          plan_interval={interval}
        />
      )
    )}
  </View>
);
