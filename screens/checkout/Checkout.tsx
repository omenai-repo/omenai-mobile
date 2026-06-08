import React, { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import tw from "twrnc";

import { differenceInCalendarDays } from "date-fns";
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createStripeTokenizedCharge } from "#services/stripe/createStripeTokenizedCharge";
import { useAppStore } from "#store/app/appStore";
import { updateSubscriptionPlan } from "#services/stripe/updateSubscriptionPlan";
import { useModalStore } from "#store/modal/modalStore";
import { utils_getCurrencySymbol } from "#utils/utils_getCurrencySymbol";
import { utils_determinePlanChange } from "#utils/utils_determinePlanChange";
import { calculateSubscriptionPricing } from "#utils/calculateSubscriptionPricing";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useStripe } from "@stripe/stripe-react-native";
import { retrieveSubscriptionData } from "#services/subscriptions/retrieveSubscriptionData";
import { invalidateGallerySubscriptionAndOrders } from "#utils/invalidateGallerySubscriptionAndOrders";
import { Analytics } from "#utils/analytics";
import { CheckoutBanner } from "./components/CheckoutBanner";
import { PricingBreakdown } from "./components/PricingBreakdown";
import { PaymentSection } from "./components/PaymentSection";
import { CheckoutCTA } from "./components/CheckoutCTA";

type RootStackParamList = {
  MigrationUpgradeCheckout: {
    plan: SubscriptionPlanDataTypes & {
      createdAt?: string;
      updatedAt?: string;
      _id?: string;
    };
    interval: "yearly" | "monthly";
    sub_data: SubscriptionModelSchemaTypes & {
      created?: string;
      updatedAt?: string;
    };
    action: string;
    discountEligible?: boolean;
  };
};

type ScreenRouteProp = RouteProp<
  RootStackParamList,
  "MigrationUpgradeCheckout"
>;

type CheckoutPricingParams = {
  isInitialSubscription: boolean;
  plan: any;
  interval: "yearly" | "monthly";
  sub_data: any;
  isSubscriptionDiscount: boolean;
  startDate: Date;
  days_used: number;
  totalDays: number;
};

const useCheckoutPricing = ({
  isInitialSubscription,
  plan,
  interval,
  sub_data,
  isSubscriptionDiscount,
  startDate,
  days_used,
  totalDays,
}: CheckoutPricingParams) => {
  const { proratedPrice, upgradeCost, grandTotal } = useMemo(() => {
    if (isInitialSubscription) {
      if (!plan?.pricing)
        return { proratedPrice: 0, upgradeCost: 0, grandTotal: 0 };
      const price =
        interval === "monthly"
          ? +plan.pricing.monthly_price
          : +plan.pricing.annual_price;
      return { proratedPrice: 0, upgradeCost: price, grandTotal: price };
    }
    if (!sub_data?.plan_details || !plan?.pricing)
      return { proratedPrice: 0, upgradeCost: 0, grandTotal: 0 };
    return calculateSubscriptionPricing(
      startDate,
      interval,
      sub_data.plan_details,
      plan,
      days_used,
      totalDays,
      isSubscriptionDiscount,
    );
  }, [
    startDate,
    interval,
    sub_data?.plan_details,
    plan,
    days_used,
    totalDays,
    isInitialSubscription,
    isSubscriptionDiscount,
  ]);

  const plan_change_params = useMemo(() => {
    if (!sub_data && !isInitialSubscription)
      return { action: "", shouldCharge: false };
    if (isInitialSubscription)
      return { action: "Initial Purchase", shouldCharge: true };
    if (!sub_data?.plan_details) return { action: "", shouldCharge: false };

    return utils_determinePlanChange(
      sub_data.plan_details.type.toLowerCase(),
      sub_data.plan_details.interval.toLowerCase() as "yearly" | "monthly",
      interval === "yearly"
        ? +(plan?.pricing?.annual_price || 0)
        : +(plan?.pricing?.monthly_price || 0),
      interval,
      sub_data.status,
    );
  }, [sub_data, interval, plan?.pricing, isInitialSubscription]);

  return { proratedPrice, upgradeCost, grandTotal, plan_change_params };
};

export default function Checkout() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<any>();
  const {
    plan,
    interval,
    sub_data: initialSubData,
    action,
    discountEligible = false,
  } = route.params;

  const { handleNextAction } = useStripe();
  const queryClient = useQueryClient();
  const { userSession: user } = useAppStore();
  const { updateModal } = useModalStore();

  const [payLoading, setPayLoading] = useState(false);
  const [migrateLoading, setMigrateLoading] = useState(false);

  const isInitialSubscription = initialSubData === null;

  const { data: fetchedData, refetch } = useQuery({
    queryKey: ["checkout_sub_data", user?.id],
    enabled: !!user?.id && !isInitialSubscription,
    queryFn: async () => {
      const res = await retrieveSubscriptionData(user.id);
      return res?.isOk && res?.data ? res.data : null;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!isInitialSubscription) refetch();
    }, [isInitialSubscription, refetch]),
  );

  const sub_data = (fetchedData || initialSubData) as any;
  const now = new Date();
  const startDate = sub_data?.start_date
    ? new Date(sub_data.start_date)
    : new Date();
  const expiryDate = sub_data?.expiry_date
    ? new Date(sub_data.expiry_date)
    : new Date();
  const currency = utils_getCurrencySymbol(plan.currency);

  const totalDays = differenceInCalendarDays(expiryDate, startDate);
  const days_used = Math.min(
    differenceInCalendarDays(now, startDate),
    totalDays,
  );
  const days_left = Math.max(totalDays - days_used, 0);
  const isSubscriptionDiscount = Boolean(sub_data?.isDiscountSub);

  const { proratedPrice, upgradeCost, grandTotal, plan_change_params } =
    useCheckoutPricing({
      isInitialSubscription,
      plan,
      interval,
      sub_data,
      isSubscriptionDiscount,
      startDate,
      days_used,
      totalDays,
    });

  const showCharge = plan_change_params.shouldCharge;

  const finalGrandTotal = useMemo(() => {
    if (discountEligible) return 0;
    return showCharge ? grandTotal : 0;
  }, [discountEligible, showCharge, grandTotal]);

  const handlePayNow = async () => {
    if (!user?.id) {
      updateModal({
        message: "Missing gallery id",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    try {
      setPayLoading(true);

      const res = await createStripeTokenizedCharge(finalGrandTotal, {
        name: user.name,
        email: user.email,
        gallery_id: user.id,
        plan_id: plan.plan_id,
        plan_interval: interval,
      });

      console.log("stripe-response ---", res);

      if (!res?.isOk) {
        Analytics.track("payment_failed", {
          message: "Unable to start charge",
          user,
          plan,
          interval,
          amount: finalGrandTotal,
          discount_eligible: discountEligible,
          error: (res as any).error,
          response: res,
        });
        updateModal({
          message: "Unable to initiate card charge. Please contact support",
          showModal: true,
          modalType: "error",
        });
        return;
      }

      const { client_secret, status, paymentIntentId } = res;
      if (status === "requires_action") {
        const { error: nextActionErr } = await handleNextAction(client_secret);
        if (nextActionErr) {
          Analytics.track("payment_failed", {
            message: nextActionErr.message,
            user,
            plan,
            interval,
            amount: finalGrandTotal,
            discount_eligible: discountEligible,
            payment_intent_id: paymentIntentId,
            failure_stage: "3d_secure_authentication",
            error: nextActionErr,
          });
          updateModal({
            message: nextActionErr.message,
            showModal: true,
            modalType: "error",
          });
          return;
        }
      }

      Analytics.track("payment_success", {
        user,
        plan,
        interval,
        amount: finalGrandTotal,
        discount_eligible: discountEligible,
        payment_intent_id: paymentIntentId,
        pricing_breakdown: {
          prorated_price: proratedPrice,
          upgrade_cost: upgradeCost,
          grand_total: finalGrandTotal,
        },
      });

      updateModal({
        message: "Processing payment...",
        showModal: true,
        modalType: "input",
      });

      await queryClient.invalidateQueries({
        queryKey: ["subscription_precheck"],
      });
      await invalidateGallerySubscriptionAndOrders(queryClient, user?.id);
      navigation.navigate("BillingVerificationScreen", {
        payment_intent: paymentIntentId,
      });
    } catch (e: any) {
      Analytics.track("payment_failed", {
        message: e?.message,
        user,
        plan,
        interval,
        amount: finalGrandTotal,
        discount_eligible: discountEligible,
        failure_stage: "exception",
        error: e,
      });
      updateModal({
        message: e?.message,
        showModal: true,
        modalType: "error",
      });
    } finally {
      setPayLoading(false);
    }
  };

  const handleMigrateToPlan = async () => {
    if (!user?.id) {
      updateModal({
        message: "Missing gallery id",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    try {
      setMigrateLoading(true);

      const data = {
        value:
          interval === "monthly"
            ? +plan.pricing.monthly_price
            : +plan.pricing.annual_price,
        currency: "USD",
        type: plan.name,
        interval,
        id: plan._id as string,
      };

      const migrate = await updateSubscriptionPlan(data, action);
      console.log(data, action, "hh");
      if (!migrate?.isOk) {
        Analytics.track("migration_failed", {
          message: migrate?.message ?? "",
          user,
          plan,
          interval,
          action,
          migration_data: data,
          error: (migrate as any).error,
          response: migrate,
        });
        updateModal({
          message: migrate?.message ?? "",
          showModal: true,
          modalType: "error",
        });
      } else {
        Analytics.track("migration_success", {
          message: "Migration successful",
          user,
          plan,
          interval,
          action,
          migration_data: data,
          response: migrate,
        });
        updateModal({
          message: "Migration successful",
          showModal: true,
          modalType: "success",
        });
        await queryClient.invalidateQueries({
          queryKey: ["subscription_precheck"],
        });
        await invalidateGallerySubscriptionAndOrders(queryClient, user?.id);
        navigation.pop(2);
      }
    } catch (e: any) {
      Analytics.track("migration_failed", {
        message: e?.message,
        user,
        plan,
        interval,
        action,
        failure_stage: "exception",
        error: e,
      });
      updateModal({
        message: e?.message,
        showModal: true,
        modalType: "success",
      });
    } finally {
      setMigrateLoading(false);
    }
  };
  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Checkout" />
      <ScrollView
        contentContainerStyle={tw`px-4 py-5`}
        showsVerticalScrollIndicator={false}
      >
        <CheckoutBanner
          actionLabel={
            discountEligible
              ? "Discount Activation"
              : plan_change_params.action || "Checkout"
          }
          planName={plan.name}
          interval={interval}
        />
        <PricingBreakdown
          isInitialSubscription={isInitialSubscription}
          days_left={days_left}
          upgradeCost={upgradeCost}
          proratedPrice={proratedPrice}
          grandTotal={finalGrandTotal}
          currency={currency}
          showCharge={showCharge}
          discountEligible={discountEligible}
          isSubscriptionDiscount={isSubscriptionDiscount}
          discountAmount={
            interval === "monthly"
              ? +plan.pricing.monthly_price
              : +plan.pricing.annual_price
          }
        />
        <PaymentSection
          isInitialSubscription={isInitialSubscription}
          plan={plan}
          interval={interval}
          sub_data={sub_data}
          discountEligible={discountEligible}
        />
        {!isInitialSubscription && (
          <CheckoutCTA
            payLoading={payLoading}
            migrateLoading={migrateLoading}
            showCharge={showCharge}
            handlePayNow={handlePayNow}
            handleMigrateToPlan={handleMigrateToPlan}
          />
        )}
        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
}
