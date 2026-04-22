import React, { useMemo } from "react";
import { View, Text, Platform } from "react-native";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { utils_getCurrencySymbol } from "#utils/utils_getCurrencySymbol";
import { utils_determinePlanChange } from "#utils/utils_determinePlanChange";
import { DiscountData } from "#services/subscriptions/retrieveSubscriptionDiscount";
import { PlanHeader } from "./plan/PlanHeader";
import { PlanPricing } from "./plan/PlanPricing";
import { PlanFeatures } from "./plan/PlanFeatures";
import { ForfeitWarning } from "./plan/ForfeitWarning";
import { PlanCTA } from "./plan/PlanCTA";

type Props = {
  plan: SubscriptionPlanDataTypes;
  tab: "monthly" | "yearly";
  sub_data: SubscriptionModelSchemaTypes | null;
  discount: DiscountData;
};

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

  // Only Gallery Monthly is eligible for the 14-day free offer.
  const isEligibleForDiscount =
    !!discount && discount.redeemed === false && name === "Gallery" && tab === "monthly";

  const showForfeitWarning =
    !!discount && discount.redeemed === false && !isEligibleForDiscount;

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
    isEligibleForDiscount && !isDisabled
      ? "Claim 14 days free subscription"
      : buttonText;

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
      {/* Most Popular badge for Gallery */}
      {name === "Gallery" && (
        <View style={tw`absolute -top-3 self-center z-10`}>
          <View style={tw`px-3 py-1 rounded-full bg-slate-900`}>
            <Text style={tw`text-white font-semibold`}>Most Popular</Text>
          </View>
        </View>
      )}

      {/* Card */}
      <View
        style={[
          tw`rounded-md overflow-hidden bg-white`,
          name === "Gallery"
            ? tw`border-2 border-slate-900`
            : tw`border border-slate-200`,
          cardShadow(),
        ]}
      >
        {/* Header */}
        <View style={tw`p-5 pb-4`}>
          <PlanHeader name={name} />

          <PlanPricing
            isEligibleForDiscount={isEligibleForDiscount}
            prettyAmount={prettyAmount}
            tab={tab}
            monthly_price={monthly_price ?? "0"}
            yearlySave={yearlySave}
            currencySymbol={currencySymbol ?? "$"}
          />
        </View>

        {/* Features */}
        <View style={tw`px-5 pb-5`}>
          <View style={tw`border-t border-slate-200 pt-4`}>
            <Text style={tw`text-slate-900 text-xs font-semibold mb-3`}>
              What’s included
            </Text>

            <PlanFeatures featureList={featureList} />

            {/* Forfeit Warning */}
            {showForfeitWarning && <ForfeitWarning targetPlan="Gallery" />}

            {/* CTA */}
            <PlanCTA
              isDisabled={isDisabled}
              handleNavigate={handleNavigate}
              name={name}
              finalButtonText={finalButtonText}
            />
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
