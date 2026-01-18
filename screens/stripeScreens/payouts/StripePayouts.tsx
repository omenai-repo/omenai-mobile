import { StyleSheet, View, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import WithModal from "#components/modal/WithModal";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { checkIsStripeOnboarded } from "#services/stripe/checkIsStripeOnboarded";
import FormSkeleton from "#components/skeleton/FormSkeleton";
import CompleteOnBoarding from "./components/CompleteOnBoarding";
import { useModalStore } from "#store/modal/modalStore";
import BlockingScreen from "./components/BlockingScreen";
import PayoutDashboard from "./components/PayoutDashboard";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { colors } from "#config/colors.config";
import { useQueryClient } from "@tanstack/react-query";

export default function StripePayouts({
  account_id,
  showScreen,
}: {
  account_id: string;
  showScreen: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [refreshCount, setRefreshCount] = useState<number>(1);

  const [refreshing, setRefreshing] = useState(false);
  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();

  async function handleOnBoardingCheck() {
    const res = await checkIsStripeOnboarded(account_id);
    if (res?.isOk) {
      setIsSubmitted(res.details_submitted);
    } else {
      updateModal({
        message: "Something went wrong, please try again or contact support",
        modalType: "error",
        showModal: true,
      });
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await handleOnBoardingCheck();
    setRefreshCount((prev) => prev + 1);
    setRefreshing(false);
  };

  useEffect(() => {
    async function init() {
      if (!showScreen) return;
      setLoading(true);
      await handleOnBoardingCheck();
      setLoading(false);
    }

    init();

    return () => {
      queryClient.invalidateQueries({ queryKey: ["subscription_precheck"] });
    };
  }, [showScreen]);

  if (!showScreen) return <BlockingScreen />;

  if (loading)
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <FormSkeleton rows={3} />
      </View>
    );

  if (!loading && showScreen)
    return (
      <WithModal>
        <BackHeaderTitle
          title={isSubmitted ? "Stripe Payout" : "Complete stripe onboarding"}
        />
        <ScrollWrapper
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.black]}
              tintColor={colors.black}
            />
          }
        >
          {!isSubmitted && <CompleteOnBoarding />}
          {isSubmitted && account_id.length > 0 && (
            <PayoutDashboard
              account_id={account_id}
              refreshCount={refreshCount}
            />
          )}
        </ScrollWrapper>
      </WithModal>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingTop: 10,
  },
});
