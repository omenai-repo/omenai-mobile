import { StyleSheet, View, RefreshControl } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import InActiveSubscription from "./features/InActiveSubscription";
import { useAppStore } from "#store/app/appStore";
import ActiveSubscriptions from "./features/ActiveSubscriptions";

import { useModalStore } from "#store/modal/modalStore";
import { retrieveSubscriptionData } from "#services/subscriptions/retrieveSubscriptionData";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { getAccountID } from "#services/stripe/getAccountID";
import { checkIsStripeOnboarded } from "#services/stripe/checkIsStripeOnboarded";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHighRiskFeatureFlag } from "#hooks/useFeatureFlag";
import SubscriptionDowntimeBlocker from "#components/blockers/payments/SubscriptionDowntimeBlocker";
import VerificationRequiredBlock from "./components/VerificationRequiredBlock";
import { colors } from "#config/colors.config";
import { screenName } from "#constants/screenNames.constants";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import PlansSkeleton from "#components/skeleton/PlansSkeleton";
import { SUBSCRIPTION_QK } from "#utils/queryKeys";

export default function Subscriptions() {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();
  const insets = useSafeAreaInsets();
  const { value: isSubscriptionBillingEnabled, loading: isFlagLoading } =
    useHighRiskFeatureFlag("subscription_creation_enabled");

  const {
    data: isConfirmed,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: SUBSCRIPTION_QK.precheck(userSession?.id),
    queryFn: async () => {
      try {
        // Fetch account ID first, as it's required for the next call
        const acc: any = await getAccountID(userSession?.id);
        if (!acc?.isOk || !acc?.data?.connected_account_id) {
          return {
            isSubmitted: false,
            id: "",
            isSubActive: false,
            subscription_data: null,
            subscription_plan: null,
          };
        }

        // Start retrieving subscription data while fetching Stripe onboarding status
        const [response, sub_check]: any = await Promise.all([
          checkIsStripeOnboarded(acc.data.connected_account_id), // Dependent on account ID
          retrieveSubscriptionData(userSession?.id), // Independent
        ]);

        if (!response?.isOk || !sub_check?.isOk) {
          updateModal({
            message: "Something went wrong, Please refresh again",
            modalType: "error",
            showModal: true,
          });
        }

        return {
          isSubmitted: response.details_submitted,
          id: acc.data.connected_account_id,
          isSubActive: sub_check?.data?.subscription_id ? true : false,
          subscription_data: sub_check.data,
          subscription_plan: sub_check.plan,
        };
      } catch (error: any) {
        updateModal({
          message: error?.message || error?.body?.message || "Something went wrong, Please refresh again",
          modalType: "error",
          showModal: true,
        });
        // Return a default object to satisfy the return type
        return {
          isSubmitted: false,
          id: "",
          isSubActive: false,
          subscription_data: null,
          subscription_plan: null,
        };
      }
    },
    enabled: !!userSession?.id,
    refetchOnWindowFocus: true,
    staleTime: 300000,
  });

  const showLoading = isLoading || isRefetching;
  const needsVerification =
    isConfirmed && (!isConfirmed.isSubmitted || !isConfirmed.id);
  const isSubActive = !!isConfirmed?.isSubActive;

  const renderContent = () => {
    if (isFlagLoading) {
      return (
        <View style={{ padding: 20 }}>
          <PlansSkeleton />
        </View>
      );
    }

    if (isSubscriptionBillingEnabled) {
      if (showLoading) {
        return (
          <View style={{ padding: 20 }}>
            <PlansSkeleton />
          </View>
        );
      }

      if (needsVerification) {
        return (
          <ScrollWrapper
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[colors.black]}
                tintColor={colors.black}
              />
            }
          >
            <VerificationRequiredBlock disableBack />
          </ScrollWrapper>
        );
      }

      return (
        <ScrollWrapper
          style={styles.mainContainer}
          contentContainerStyle={
            isSubActive ? undefined : { flexGrow: 1, justifyContent: "center" }
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.black]}
              tintColor={colors.black}
            />
          }
        >
          {isSubActive ? (
            <ActiveSubscriptions
              subscription_data={isConfirmed?.subscription_data}
              subscription_plan={isConfirmed?.subscription_plan}
            />
          ) : (
            <InActiveSubscription />
          )}
          <View style={{ paddingVertical: 30 }} />
        </ScrollWrapper>
      );
    }

    return <SubscriptionDowntimeBlocker />;
  };

  return (
    <View
      style={{
        paddingTop: isSubscriptionBillingEnabled ? 0 : insets.top + 16,
        flex: 1,
      }}
    >
      {isSubscriptionBillingEnabled || isFlagLoading ? (
        <BackHeaderTitle
          title="Subscription & Billing"
          customGoBack={() => navigation.navigate(screenName.gallery.overview)}
        />
      ) : null}

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mainContainer: {
    flex: 1,
  },
});
