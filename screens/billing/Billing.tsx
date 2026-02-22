import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import type { PlanProps, SubscriptionModelSchemaTypes } from "#types/types";

import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Header from "./components/Header";
import Plan from "./components/Plan";
import { getAllPlanData } from "#services/subscriptions/getAllPlanData";
import PlansSkeleton from "#components/skeleton/PlansSkeleton";
import EmptyArtworks from "#components/general/EmptyArtworks";
import { useModalStore } from "#store/modal/modalStore";
import { retrieveSubscriptionData } from "#services/subscriptions/retrieveSubscriptionData";
import {
  retrieveSubscriptionDiscount,
  DiscountData,
} from "#services/subscriptions/retrieveSubscriptionDiscount";
import { useAppStore } from "#store/app/appStore";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { checkIsStripeOnboarded } from "#services/stripe/checkIsStripeOnboarded";
import { getAccountID } from "#services/stripe/getAccountID";
import LockScreen from "../galleryArtworksListing/components/LockScreen";
import OnboardingRequiredBlock from "../subscriptions/components/OnboardingRequiredBlock";

export type billingTabs = "monthly" | "yearly";

export default function Billing() {
  const [selectedTab, setSelectedTab] = useState<billingTabs>("monthly");
  const [plans, setPlans] = useState<PlanProps[]>([]);
  const [subData, setSubData] = useState<SubscriptionModelSchemaTypes | null>(
    null,
  );
  const [discount, setDiscount] = useState<DiscountData>(null);
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { userSession, userType } = useAppStore();

  const [isOnboarded, setIsOnboarded] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check verification status
  const isVerified =
    userType === "gallery"
      ? userSession?.gallery_verified
      : userSession?.artist_verified || userSession?.verified;

  console.log("Debug Verification:", {
    userType,
    isVerified,
    gallery_verified: userSession?.gallery_verified,
    verified: userSession?.verified,
    artist_verified: userSession?.artist_verified,
    fullSession: JSON.stringify(userSession || {}, null, 2),
  });

  // Check onboarding status
  useEffect(() => {
    async function checkOnboarding() {
      if (!userSession?.id) {
        setCheckingOnboarding(false);
        return;
      }
      try {
        const connectedId = await getAccountID(userSession.id);
        if (connectedId?.data?.connected_account_id) {
          const res = await checkIsStripeOnboarded(
            connectedId.data.connected_account_id,
          );
          // Strict check: Only set to true if response is OK AND details are submitted
          if (res?.isOk && res.details_submitted) {
            setIsOnboarded(true);
          } else {
            setIsOnboarded(false);
          }
        } else {
          // No connected ID -> Not onboarded
          setIsOnboarded(false);
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setIsOnboarded(false); // Fail safe
      } finally {
        setCheckingOnboarding(false);
      }
    }
    checkOnboarding();
  }, [userSession?.id]);

  useEffect(() => {
    async function handleFetchPlans() {
      // Gate 1: If not verified, don't fetch (LockScreen will show)
      if (!isVerified) return;

      // Gate 2: If finding onboarding status, don't fetch (Skeleton will show)
      if (checkingOnboarding) return;

      // Gate 3: If not onboarded, don't fetch (OnboardingRequiredBlock will show)
      if (!isOnboarded) return;

      setLoading(true);
      const [results, subResults, discountResults] = await Promise.all([
        getAllPlanData(),
        userSession?.id
          ? retrieveSubscriptionData(userSession.id)
          : Promise.resolve({ isOk: false, data: null }),
        retrieveSubscriptionDiscount(),
      ]);

      if (!results?.isOk && !subResults?.isOk) {
        //throw error
        updateModal({
          message: "Something went wrong",
          modalType: "error",
          showModal: true,
        });
      } else {
        const sortedPlans = (results?.data || []).sort(
          (a: PlanProps, b: PlanProps) => {
            const priceA = +(a?.pricing?.monthly_price || 0);
            const priceB = +(b?.pricing?.monthly_price || 0);
            return priceA - priceB;
          },
        );
        setPlans(sortedPlans);
        setSubData(subResults?.data);
        setDiscount(discountResults?.discount ?? null);
        console.log("Plans Data:", JSON.stringify(sortedPlans, null, 2));
        console.log("Subscription Data:", JSON.stringify(subResults, null, 2));
        console.log("Discount Data:", JSON.stringify(discountResults, null, 2));
      }

      setLoading(false);
    }

    handleFetchPlans();
  }, [isVerified, checkingOnboarding, isOnboarded, userSession?.id]);

  if (checkingOnboarding) {
    return (
      <>
        <BackHeaderTitle title="Billing" />
        <ScrollWrapper style={styles.container}>
          <PlansSkeleton />
        </ScrollWrapper>
      </>
    );
  }

  // Priority 1: Verification Blocker
  if (!isVerified) {
    return <LockScreen name={userSession?.name} />;
  }

  if (!isOnboarded) {
    return <OnboardingRequiredBlock />;
  }

  return (
    <>
      <BackHeaderTitle title="Billing" />
      <ScrollWrapper style={styles.container}>
        <Header selectedTab={selectedTab} handleUpdate={setSelectedTab} />
        {loading && <PlansSkeleton />}
        {!loading && plans.length > 0 && (
          <View style={styles.mainContainer}>
            {plans.map((plan) => (
              <Plan
                key={plan.name}
                tab={selectedTab}
                plan={plan}
                sub_data={subData}
                discount={discount}
              />
            ))}
          </View>
        )}
        {!loading && plans.length === 0 && (
          <EmptyArtworks
            size={70}
            writeUp="No plans at the moment, reload or check again later"
          />
        )}
      </ScrollWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mainContainer: {
    marginTop: 20,
    gap: 20,
    paddingBottom: 50,
  },
});
