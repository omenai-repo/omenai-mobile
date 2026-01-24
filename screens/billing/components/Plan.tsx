import React, { useMemo } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { utils_getCurrencySymbol } from "#utils/utils_getCurrencySymbol";
import { utils_determinePlanChange } from "#utils/utils_determinePlanChange";
import { DiscountData } from "#services/subscriptions/retrieveSubscriptionDiscount";
import {
  SubscriptionModelSchemaTypes,
  SubscriptionPlanDataTypes,
} from "#types/types";

type Props = {
  plan: SubscriptionPlanDataTypes;
  tab: "monthly" | "yearly";
  sub_data: SubscriptionModelSchemaTypes | null;
  discount: DiscountData;
};

// Forfeit Warning Component
const ForfeitWarning = ({ targetPlan }: { targetPlan: string }) => (
  <View style={tw`mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3`}>
    <View style={tw`flex-row gap-2`}>
      <Text style={tw`text-amber-600`}>⚠️</Text>
      <Text
        style={tw`text-[11px] leading-relaxed font-medium text-amber-800 flex-1`}
      >
        Selecting this plan will <Text style={tw`font-bold`}>forfeit</Text> your
        one-time 100% discount on the monthly{" "}
        <Text style={tw`capitalize font-bold`}>{targetPlan}</Text> plan.
      </Text>
    </View>
  </View>
);

export default function Plan({
  plan,
  tab,
  sub_data,
  discount,
}: Readonly<Props>) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const { name, benefits, pricing, currency } = plan;
  const plan_action: string | null = route?.params?.plan_action ?? null;

  const currencySymbol = utils_getCurrencySymbol(currency);

  const featureList: string[] = useMemo(() => {
    if (Array.isArray(benefits)) return benefits;
    return tab === "monthly" ? benefits.monthly : benefits.annual;
  }, [benefits, tab]);

  // Determine the plan change action & charge behavior
  const planChange = useMemo(() => {
    if (!sub_data) return { action: "", shouldCharge: false };
    return utils_determinePlanChange(
      sub_data.plan_details.type.toLowerCase(),
      sub_data.plan_details.interval.toLowerCase() as "monthly" | "yearly",
      tab === "yearly" ? +pricing.annual_price : +pricing.monthly_price,
      tab,
      sub_data.status,
    );
  }, [sub_data, pricing, tab]);

  // Button label logic
  const buttonText = useMemo(() => {
    if (!sub_data) return "Get started today";
    if (sub_data.status === "expired") return "Get started today";
    if (plan_action === "reactivation") return "Activate plan";
    if (
      sub_data.plan_details.type !== name ||
      (sub_data.plan_details.type === name &&
        sub_data.plan_details.interval !== tab)
    ) {
      return "Migrate";
    }
    return "Subscribed";
  }, [sub_data, plan_action, name, tab]);

  // Disabled logic
  const isDisabled = useMemo(() => {
    if (!sub_data) return false;
    const isSamePlan =
      sub_data.plan_details.type === name &&
      sub_data.plan_details.interval === tab;
    const isActiveNoAction =
      sub_data.status === "active" && isSamePlan && plan_action === null;
    return isActiveNoAction;
  }, [sub_data, name, tab, plan_action]);

  const { monthly_price, annual_price } = pricing;

  // Discount eligibility logic
  const isEligibleForDiscount =
    discount !== null &&
    discount.plan === name.toLowerCase() &&
    discount.redeemed === false &&
    tab === "monthly";

  const showForfeitWarning =
    discount !== null && discount.redeemed === false && !isEligibleForDiscount;

  // Calculate amount with discount consideration
  let amount: number;
  if (isEligibleForDiscount) {
    amount = 0;
  } else if (tab === "monthly") {
    amount = Number(monthly_price);
  } else {
    amount = Number(annual_price);
  }

  const prettyAmount = utils_formatPrice(amount, currencySymbol, 0);

  // Update button text for discount
  const finalButtonText =
    isEligibleForDiscount && !isDisabled ? "Activate free plan" : buttonText;

  const yearlySave =
    tab === "yearly"
      ? Math.max(0, Number(monthly_price) * 12 - Number(annual_price)).toFixed(
          0,
        )
      : null;

  const handleNavigate = () => {
    const action = sub_data ? planChange.action : null;
    navigation.navigate(screenName.checkout, {
      plan,
      interval: tab,
      sub_data,
      action: plan_action ? plan_action : action,
      discountEligible: isEligibleForDiscount,
    });
  };

  return (
    <View style={[tw`relative w-full`, { marginVertical: 12 }]}>
      {/* Most Popular badge for Pro */}
      {name === "Pro" && (
        <View style={tw`absolute -top-3 self-center z-10`}>
          <View style={tw`px-3 py-1 rounded-full bg-blue-600`}>
            <Text style={tw`text-white font-semibold`}>Most Popular</Text>
          </View>
        </View>
      )}

      {/* Card */}
      <View
        style={[
          tw`rounded-2xl overflow-hidden bg-white`,
          name === "Pro"
            ? tw`border-2 border-blue-600`
            : tw`border border-slate-200`,
          cardShadow(),
        ]}
      >
        {/* Header */}
        <View style={tw`p-5 pb-4`}>
          <View style={tw`flex-row items-start justify-between`}>
            <View>
              <Text style={tw`text-slate-900 text-lg font-bold`}>{name}</Text>
              <Text style={tw`mt-1 text-slate-600 text-xs`}>
                {name === "Basic" && "Essential features to get started"}
                {name === "Pro" && "Perfect for growing businesses"}
                {name === "Premium" && "Advanced features for scale"}
              </Text>
            </View>

            {name === "Premium" && (
              <View style={tw`p-2 rounded-lg bg-purple-100`}>
                <Ionicons name="sparkles" size={16} color="#7c3aed" />
              </View>
            )}
          </View>

          {/* Pricing */}
          <View style={tw`mt-4 flex-row items-baseline`}>
            <Text style={tw`text-3xl font-bold text-slate-900`}>
              {prettyAmount}
            </Text>
            {!isEligibleForDiscount && (
              <Text style={tw`ml-2 text-base text-slate-500`}>
                /{tab === "monthly" ? "month" : "year"}
              </Text>
            )}
          </View>

          {/* Discount badge or yearly savings */}
          {isEligibleForDiscount ? (
            <Text style={tw`mt-1 text-xs font-medium text-emerald-600`}>
              100% off · Applied once to this plan
            </Text>
          ) : (
            yearlySave && (
              <Text style={tw`mt-1 text-xs text-green-600 font-medium`}>
                Save {currencySymbol}
                {yearlySave} per year
              </Text>
            )
          )}
        </View>

        {/* Features */}
        <View style={tw`px-5 pb-5`}>
          <View style={tw`border-t border-slate-200 pt-4`}>
            <Text style={tw`text-slate-900 text-xs font-semibold mb-3`}>
              What’s included
            </Text>

            <View style={tw`rounded-lg bg-slate-50 p-3`}>
              {featureList.map((benefit, i) => (
                <View
                  key={`${benefit}-${i}`}
                  style={tw`flex-row items-start mb-2`}
                >
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#0f172a"
                    style={tw`mt-0.5`}
                  />
                  <Text
                    style={tw`ml-2 text-[12px] leading-5 text-slate-600 flex-1`}
                  >
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>

            {/* Forfeit Warning */}
            {showForfeitWarning && (
              <ForfeitWarning targetPlan={discount.plan} />
            )}

            {/* CTA */}
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
                  name === "Pro" ? "bg-blue-600" : "bg-slate-900",
                  opacityStyle,
                );
              }}
              accessibilityRole="button"
              accessibilityLabel={finalButtonText}
            >
              <Text style={tw`text-white text-sm font-medium`}>
                {finalButtonText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function cardShadow() {
  return Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 4 },
    default: {},
  });
}
